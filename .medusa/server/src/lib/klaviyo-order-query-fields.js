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
    "summary",
    "customer.email",
    "items.id",
    "items.variant_id",
    "items.title",
    "items.detail.quantity",
    "items.detail.raw_quantity",
    "items.unit_price",
    "items.raw_unit_price",
    "items.is_tax_inclusive",
    "items.product_id",
    "items.thumbnail",
    "items.subtitle",
    "items.metadata",
    "items.tax_lines.rate",
    "items.tax_lines.code",
    "items.adjustments.code",
    "items.adjustments.amount",
    "shipping_methods.shipping_method.id",
    "shipping_methods.amount",
    "shipping_methods.is_tax_inclusive",
    "shipping_methods.tax_lines.rate",
    "shipping_methods.adjustments.code",
    "shipping_methods.adjustments.amount",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1xdWVyeS1maWVsZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2tsYXZpeW8tb3JkZXItcXVlcnktZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXVEQSxnRUFFQztBQXpERDs7Ozs7Ozs7OztHQVVHO0FBQ1UsUUFBQSwyQkFBMkIsR0FBRztJQUN6QyxJQUFJO0lBQ0osWUFBWTtJQUNaLE9BQU87SUFDUCxlQUFlO0lBQ2YsT0FBTztJQUNQLFVBQVU7SUFDVixXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsU0FBUztJQUNULGdCQUFnQjtJQUNoQixVQUFVO0lBQ1Ysa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsMkJBQTJCO0lBQzNCLGtCQUFrQjtJQUNsQixzQkFBc0I7SUFDdEIsd0JBQXdCO0lBQ3hCLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsc0JBQXNCO0lBQ3RCLHdCQUF3QjtJQUN4QiwwQkFBMEI7SUFDMUIscUNBQXFDO0lBQ3JDLHlCQUF5QjtJQUN6QixtQ0FBbUM7SUFDbkMsaUNBQWlDO0lBQ2pDLG1DQUFtQztJQUNuQyxxQ0FBcUM7SUFDckMsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsd0JBQXdCO0lBQ3hCLHlDQUF5QztJQUN6QywwQkFBMEI7Q0FDbEIsQ0FBQTtBQUVWLDBGQUEwRjtBQUMxRixTQUFnQiwwQkFBMEIsQ0FBQyxPQUFlO0lBQ3hELE9BQU8sZ0JBQWdCLE9BQU8sRUFBRSxDQUFBO0FBQ2xDLENBQUMifQ==