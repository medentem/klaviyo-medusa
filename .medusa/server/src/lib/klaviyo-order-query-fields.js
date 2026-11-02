"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KLAVIYO_PLACED_ORDER_FIELDS = void 0;
exports.klaviyoPlacedOrderUniqueId = klaviyoPlacedOrderUniqueId;
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
exports.KLAVIYO_PLACED_ORDER_FIELDS = [
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
];
/** Stable Klaviyo event id so retries and replays do not create a second Placed Order. */
function klaviyoPlacedOrderUniqueId(orderId) {
    return `placed-order-${orderId}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1xdWVyeS1maWVsZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2tsYXZpeW8tb3JkZXItcXVlcnktZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQTRDQSxnRUFFQztBQTlDRDs7Ozs7Ozs7OztHQVVHO0FBQ1UsUUFBQSwyQkFBMkIsR0FBRztJQUN6QyxJQUFJO0lBQ0osWUFBWTtJQUNaLE9BQU87SUFDUCxlQUFlO0lBQ2YsT0FBTztJQUNQLFVBQVU7SUFDVixXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsZ0JBQWdCO0lBQ2hCLFVBQVU7SUFDVixrQkFBa0I7SUFDbEIsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLHdCQUF3QjtJQUN4QixxQ0FBcUM7SUFDckMsbUNBQW1DO0lBQ25DLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsd0JBQXdCO0lBQ3hCLHdCQUF3QjtJQUN4Qix5Q0FBeUM7SUFDekMsMEJBQTBCO0NBQ2xCLENBQUE7QUFFViwwRkFBMEY7QUFDMUYsU0FBZ0IsMEJBQTBCLENBQUMsT0FBZTtJQUN4RCxPQUFPLGdCQUFnQixPQUFPLEVBQUUsQ0FBQTtBQUNsQyxDQUFDIn0=