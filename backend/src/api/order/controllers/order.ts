/**
 * order controller
 *
 * Controlador personalizado para:
 * 1. Auto-asignar el usuario autenticado al crear una orden
 * 2. Filtrar órdenes para mostrar solo las del usuario autenticado
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    // ============================================================
    // CREATE: Auto-asignar el usuario autenticado a la orden
    // ============================================================
    async create(ctx) {
        // Obtener el usuario autenticado del token JWT
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para crear una orden');
        }

        // Inyectar la relación del usuario
        // Usamos documents service para evitar validaciones estrictas del body
        const { data } = ctx.request.body;

        // Asegurar que paymentStatus y orderStatus tengan valores por defecto si no vienen
        const orderData = {
            ...data,
            users_permissions_user: user.documentId,
            publishedAt: new Date(), // Publicar inmediatamente
        };

        try {
            // Crear la orden usando Document Service (Strapi 5)
            const newOrder = await strapi.documents('api::order.order').create({
                data: orderData,
                status: 'published',
            });

            const sanitizedEntity = await this.sanitizeOutput(newOrder, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            ctx.throw(500, error);
        }
    },

    // ============================================================
    // FIND: Solo devolver las órdenes del usuario autenticado
    // ============================================================
    async find(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para ver tus órdenes');
        }

        try {
            // Combinar filtros del frontend con el filtro de seguridad de usuario
            const { filters, ...query } = ctx.query;

            // Strapi 5 prefiere documentId para filtrar relaciones
            const userFilter = {
                users_permissions_user: {
                    documentId: {
                        $eq: user.documentId
                    }
                }
            };

            const orders = await strapi.documents('api::order.order').findMany({
                ...query,
                filters: {
                    ...((filters as any) || {}),
                    ...userFilter
                }
            });

            const sanitizedEntity = await this.sanitizeOutput(orders, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error: any) {
            console.error('ERROR en find:', error);
            ctx.throw(400, error.message || 'Error al recuperar pedidos');
        }
    },

    // ============================================================
    // FIND ONE: Verificar que la orden pertenece al usuario
    // ============================================================
    async findOne(ctx) {
        const user = ctx.state.user;
        const { id } = ctx.params; // En Strapi 5 id es el documentId

        if (!user) {
            return ctx.unauthorized('Debes iniciar sesión para ver esta orden');
        }

        try {
            const order = await strapi.documents('api::order.order').findOne({
                documentId: id,
                populate: ['users_permissions_user'],
            });

            if (!order) {
                return ctx.notFound('Orden no encontrada');
            }

            // Verificar pertenencia usando el documentId del usuario
            const orderUserDocId = order.users_permissions_user?.documentId;

            if (orderUserDocId && orderUserDocId !== user.documentId) {
                return ctx.forbidden('No tienes permiso para ver esta orden');
            }

            const sanitizedEntity = await this.sanitizeOutput(order, ctx);
            return this.transformResponse(sanitizedEntity);
        } catch (error) {
            ctx.throw(400, error);
        }
    },
}));
