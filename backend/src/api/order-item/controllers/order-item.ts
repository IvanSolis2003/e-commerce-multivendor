/**
 * order-item controller
 *
 * Las lineas de pedido solo pueden verse por el dueño del pedido al que
 * pertenecen. Sin ese filtro el controlador por defecto devuelve las lineas de
 * todos los usuarios, y expone que se vendio, a que precio y en que cantidad.
 *
 * Ademas, el precio de cada linea se toma del catalogo, nunca del cliente, y al
 * crearla se recalculan los importes del pedido al que pertenece.
 */

import { factories } from '@strapi/strapi';

const redondear = (n: number) => Math.round(n * 100) / 100;

export default factories.createCoreController('api::order-item.order-item', ({ strapi }) => ({
    // ============================================================
    // CREATE: precio y subtotal derivados del producto
    // ============================================================
    async create(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para añadir líneas a un pedido');
        }

        const { data } = ctx.request.body;
        const { order: documentIdPedido, product: documentIdProducto, quantity } = data || {};

        if (!documentIdPedido || !documentIdProducto) {
            return ctx.badRequest('Faltan el pedido o el producto');
        }

        const cantidad = Number.parseInt(String(quantity), 10);
        if (!Number.isInteger(cantidad) || cantidad < 1) {
            return ctx.badRequest('La cantidad debe ser un entero mayor que cero');
        }

        try {
            // El pedido debe existir y pertenecer al usuario autenticado
            const pedido = await strapi.documents('api::order.order').findOne({
                documentId: String(documentIdPedido),
                populate: ['users_permissions_user'],
            });

            if (!pedido) {
                return ctx.notFound('Pedido no encontrado');
            }

            const dueno = (pedido as any).users_permissions_user?.documentId;
            if (!dueno || dueno !== user.documentId) {
                return ctx.forbidden('No puedes añadir líneas a un pedido que no es tuyo');
            }

            // El precio sale del catalogo, no del cliente
            const producto = await strapi.documents('api::product.product').findOne({
                documentId: String(documentIdProducto),
            });

            if (!producto) {
                return ctx.notFound('Producto no encontrado');
            }

            const precio = Number((producto as any).price || 0);
            const descuento = Number((producto as any).discount || 0);
            const stockDisponible = Number((producto as any).stock || 0);

            // Comprobacion temprana, solo para dar un mensaje util. La garantia
            // real es el descuento condicional de mas abajo.
            if (stockDisponible < cantidad) {
                return ctx.badRequest(
                    `No hay stock suficiente de ${(producto as any).name}: quedan ${stockDisponible} y se piden ${cantidad}`
                );
            }

            let nuevaLinea: any;

            await strapi.db.transaction(async ({ trx }) => {
                // Descuento atomico y condicional. El checkout envia las lineas
                // en paralelo, asi que leer el stock y restarlo por separado
                // permitiria que dos peticiones simultaneas pasaran ambas la
                // comprobacion. Aqui la condicion viaja dentro del UPDATE: si
                // otra peticion se adelanto y ya no queda suficiente, no se
                // afecta ninguna fila.
                //
                // El filtro es por document_id y no por id porque draft & publish
                // guarda dos filas por producto: hay que descontar en las dos o
                // el panel de admin y la API acaban mostrando cifras distintas.
                const filasAfectadas = await trx('products')
                    .where('document_id', String(documentIdProducto))
                    .andWhere('stock', '>=', cantidad)
                    .decrement('stock', cantidad);

                if (!filasAfectadas) {
                    throw Object.assign(new Error('Stock insuficiente'), { sinStock: true });
                }

                nuevaLinea = await strapi.documents('api::order-item.order-item').create({
                    data: {
                        order: String(documentIdPedido),
                        product: String(documentIdProducto),
                        productName: (producto as any).name,
                        productSku: (producto as any).sku || '',
                        quantity: cantidad,
                        price: precio,
                        discount: descuento,
                        subtotal: redondear(precio * cantidad),
                        publishedAt: new Date(),
                    },
                    status: 'published',
                });
            });

            // Con la linea ya creada, los importes del pedido se rehacen
            await strapi.service('api::order.order').recalcularTotales(String(documentIdPedido));

            const sanitizedEntity = await this.sanitizeOutput(nuevaLinea, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error: any) {
            // Si el descuento condicional no encontro stock, la transaccion se
            // deshizo entera: no queda ni linea creada ni stock restado.
            if (error?.sinStock) {
                return ctx.badRequest('No hay stock suficiente para completar el pedido');
            }
            strapi.log.error('Error al crear la línea de pedido', error);
            return ctx.badRequest('No se pudo crear la línea de pedido');
        }
    },

    // ============================================================
    // FIND: solo las lineas de los pedidos del usuario autenticado
    // ============================================================
    async find(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para ver las líneas de pedido');
        }

        try {
            const { filters, ...query } = ctx.query;
            const filtrosCliente = (filters as any) || {};

            // Se conserva el filtro que envie el cliente (por ejemplo, las
            // lineas de un pedido concreto) y se le añade la restriccion de
            // pertenencia, en vez de reemplazarlo.
            const items = await strapi.documents('api::order-item.order-item').findMany({
                ...query,
                filters: {
                    ...filtrosCliente,
                    order: {
                        ...(filtrosCliente.order || {}),
                        users_permissions_user: {
                            documentId: { $eq: user.documentId },
                        },
                    },
                },
            });

            const sanitizedEntity = await this.sanitizeOutput(items, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error: any) {
            strapi.log.error('Error al recuperar líneas de pedido', error);
            return ctx.badRequest('No se pudieron recuperar las líneas de pedido');
        }
    },

    // ============================================================
    // FIND ONE: verificar que la linea pertenece a un pedido del usuario
    // ============================================================
    async findOne(ctx) {
        const user = ctx.state.user;
        const { id } = ctx.params;

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para ver esta línea de pedido');
        }

        try {
            const item = await strapi.documents('api::order-item.order-item').findOne({
                documentId: id,
                populate: { order: { populate: ['users_permissions_user'] } },
            });

            if (!item) {
                return ctx.notFound('Línea de pedido no encontrada');
            }

            const dueno = (item as any).order?.users_permissions_user?.documentId;

            // Se deniega tambien cuando no hay dueño: un pedido huerfano no
            // debe quedar accesible para cualquier usuario autenticado.
            if (!dueno || dueno !== user.documentId) {
                return ctx.forbidden('No tienes permiso para ver esta línea de pedido');
            }

            const sanitizedEntity = await this.sanitizeOutput(item, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error: any) {
            strapi.log.error('Error al recuperar la línea de pedido', error);
            return ctx.badRequest('No se pudo recuperar la línea de pedido');
        }
    },
}));
