/**
 * order service
 *
 * Aqui viven las reglas de negocio economicas. Antes existian solo en el
 * frontend (components/checkout/CheckoutForm.tsx), de modo que el servidor
 * aceptaba como validos los importes que le mandara el cliente.
 */

import { factories } from '@strapi/strapi';

// Reglas de negocio. Deben coincidir con lo que muestra el checkout.
export const UMBRAL_ENVIO_GRATIS = 50000;
export const COSTO_ENVIO = 2990;
export const PORCENTAJE_DESCUENTO = 0.05;

const redondear = (n: number) => Math.round(n * 100) / 100;

export default factories.createCoreService('api::order.order', ({ strapi }) => ({
    /**
     * Recalcula los importes de un pedido a partir de sus lineas, que a su vez
     * toman el precio del catalogo. Ningun importe procede del cliente.
     */
    async recalcularTotales(documentIdPedido: string) {
        const lineas = await strapi.documents('api::order-item.order-item').findMany({
            filters: { order: { documentId: { $eq: documentIdPedido } } },
            fields: ['subtotal'],
            pagination: { limit: -1 },
        });

        const subtotal = redondear(
            lineas.reduce((suma: number, l: any) => suma + Number(l.subtotal || 0), 0)
        );

        const superaUmbral = subtotal >= UMBRAL_ENVIO_GRATIS;
        const discount = superaUmbral ? redondear(subtotal * PORCENTAJE_DESCUENTO) : 0;
        const shippingCost = superaUmbral ? 0 : COSTO_ENVIO;
        const tax = 0;
        const totalAmount = redondear(subtotal - discount + shippingCost + tax);

        await strapi.documents('api::order.order').update({
            documentId: documentIdPedido,
            data: { subtotal, discount, shippingCost, tax, totalAmount },
            status: 'published',
        });

        return { subtotal, discount, shippingCost, tax, totalAmount };
    },
}));
