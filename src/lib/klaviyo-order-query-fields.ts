/**
 * Order graph fields for the Placed Order event.
 *
 * Medusa 2.18 loads shipping adjustments on any order query that selects totals,
 * then throws "Shipping method version is required to load adjustments" unless the
 * projection includes an explicit dotted `shipping_methods.shipping_method.` field.
 * Wildcards do not count: `shipping_methods.*` and `shipping_methods.shipping_method.*`
 * still omit `order_shipping.version` under SELECT_IN (pagination).
 *
 * @see https://github.com/medusajs/medusa/issues/16240
 */
export const KLAVIYO_PLACED_ORDER_FIELDS = [
  "id",
  "display_id",
  "email",
  "currency_code",
  "total",
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "metadata",
  "customer.email",
  "items.id",
  "items.variant_id",
  "items.title",
  "items.quantity",
  "items.unit_price",
  "items.product_id",
  "items.thumbnail",
  "items.subtitle",
  "items.metadata",
  "items.adjustments.code",
  "shipping_methods.shipping_method.id",
  "shipping_methods.adjustments.code",
  "promotions.code",
  "promotions.metadata",
  "promotions.campaign_id",
  "promotions.campaign.id",
  "promotions.campaign.campaign_identifier",
  "promotions.campaign.name",
] as const

/** Stable Klaviyo event id so retries and replays do not create a second Placed Order. */
export function klaviyoPlacedOrderUniqueId(orderId: string): string {
  return `placed-order-${orderId}`
}
