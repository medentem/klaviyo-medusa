"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const klaviyo_1 = require("../../types/klaviyo");
const klaviyo_order_query_fields_1 = require("../../lib/klaviyo-order-query-fields");
const klaviyo_order_promo_fields_1 = require("./klaviyo-order-promo-fields");
function resolvePlacedOrderEmail(order) {
    const fromOrder = typeof order.email === "string" ? order.email.trim() : "";
    if (fromOrder) {
        return fromOrder;
    }
    const fromCustomer = typeof order.customer?.email === "string" ? order.customer.email.trim() : "";
    return fromCustomer || undefined;
}
const sendOrderEventStep = (0, workflows_sdk_1.createStep)("send-order-event", async (order, context) => {
    if (!order) {
        return new workflows_sdk_1.StepResponse("Order not found", null);
    }
    const klaviyoService = context.container.resolve(klaviyo_1.KLAVIYO_MODULE);
    const email = resolvePlacedOrderEmail(order);
    if (!email) {
        return new workflows_sdk_1.StepResponse("No customer email available", null);
    }
    const orderForPromos = order;
    const discount_codes = (0, klaviyo_order_promo_fields_1.collectDiscountCodesForKlaviyo)(orderForPromos);
    const campaignProps = (0, klaviyo_order_promo_fields_1.buildOrderCampaignKlaviyoProperties)(orderForPromos);
    const uniqueId = (0, klaviyo_order_query_fields_1.klaviyoPlacedOrderUniqueId)(order.id);
    const eventPayload = {
        properties: {
            orderId: order.id,
            orderNumber: order.display_id || order.id,
            total: order.total,
            subtotal: order.subtotal,
            tax: order.tax_total,
            currency: order.currency_code,
            shipping: order.shipping_total,
            discount_total: order.discount_total,
            discount_codes,
            ...campaignProps,
            items: (order.items || []).flatMap((item) => {
                if (!item) {
                    return [];
                }
                const meta = item.metadata;
                const displayLines = meta?.product_builder === true && Array.isArray(meta.display_lines)
                    ? meta.display_lines.filter((x) => typeof x === "string" && x.trim().length > 0)
                    : undefined;
                return [
                    {
                        id: item.variant_id,
                        title: item.title,
                        quantity: item.quantity,
                        price: item.unit_price,
                        product_id: item.product_id,
                        thumbnail: item.thumbnail,
                        subtitle: item.subtitle ?? undefined,
                        options_summary: displayLines && displayLines.length
                            ? displayLines.join(" · ")
                            : item.subtitle ?? undefined,
                    },
                ];
            }),
        },
        metric: {
            data: {
                type: "metric",
                attributes: {
                    name: "Placed Order",
                },
            },
        },
        profile: {
            data: {
                type: "profile",
                attributes: {
                    email,
                },
            },
        },
        unique_id: uniqueId,
    };
    const event = await klaviyoService.createEvent(eventPayload);
    return new workflows_sdk_1.StepResponse(`Order placed event sent to Klaviyo for order ${order.id} (unique_id=${uniqueId})`, event);
});
exports.default = sendOrderEventStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1vcmRlci1ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvc2VuZC1vcmRlci1ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFFQUE0RTtBQUU1RSxpREFBcUU7QUFDckUscUZBQWlGO0FBQ2pGLDZFQUdxQztBQUdyQyxTQUFTLHVCQUF1QixDQUM5QixLQUF3QjtJQUV4QixNQUFNLFNBQVMsR0FBRyxPQUFPLEtBQUssQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDM0UsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7SUFDRCxNQUFNLFlBQVksR0FDaEIsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDOUUsT0FBTyxZQUFZLElBQUksU0FBUyxDQUFBO0FBQ2xDLENBQUM7QUFFRCxNQUFNLGtCQUFrQixHQUFHLElBQUEsMEJBQVUsRUFDbkMsa0JBQWtCLEVBQ2xCLEtBQUssRUFBRSxLQUErQixFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ2pELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNYLE9BQU8sSUFBSSw0QkFBWSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFRCxNQUFNLGNBQWMsR0FDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQWtCLHdCQUFjLENBQUMsQ0FBQTtJQUU1RCxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUU1QyxJ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