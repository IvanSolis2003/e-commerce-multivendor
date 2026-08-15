/**
 * order-item controller
 *
 * Las lineas de pedido solo pueden verse por el dueño del pedido al que
 * pertenecen. Sin este filtro el controlador por defecto devuelve las lineas de
 * todos los usuarios, y expone que se vendio, a que precio y en que cantidad.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order-item.order-item', ({ strapi }) => ({
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
