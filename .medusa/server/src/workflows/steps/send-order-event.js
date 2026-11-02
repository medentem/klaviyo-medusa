"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const klaviyo_1 = require("../../types/klaviyo");
const klaviyo_order_amounts_1 = require("../../lib/klaviyo-order-amounts");
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
    const items = (order.items || []).flatMap((item) => {
        if (!item) {
            return [];
        }
        const meta = item.metadata;
        const displayLines = meta?.product_builder === true && Array.isArray(meta.display_lines)
            ? meta.display_lines.filter((x) => typeof x === "string" && x.trim().length > 0)
            : undefined;
        const quantity = (0, klaviyo_order_amounts_1.lineQuantity)(item);
        const price = (0, klaviyo_order_amounts_1.plainAmount)(item.raw_unit_price) || (0, klaviyo_order_amounts_1.plainAmount)(item.unit_price);
        return [
            {
                id: item.variant_id,
                title: item.title,
                quantity,
                price,
                product_id: item.product_id,
                thumbnail: item.thumbnail,
                subtitle: item.subtitle ?? undefined,
                options_summary: displayLines && displayLines.length
                    ? displayLines.join(" · ")
                    : item.subtitle ?? undefined,
            },
        ];
    });
    const subtotalFromLines = items.reduce((sum, item) => sum + (0, klaviyo_order_amounts_1.plainAmount)(item.price) * (0, klaviyo_order_amounts_1.plainAmount)(item.quantity), 0);
    const eventPayload = {
        properties: {
            orderId: order.id,
            orderNumber: order.display_id || order.id,
            total: (0, klaviyo_order_amounts_1.orderGrandTotal)(order),
            subtotal: (0, klaviyo_order_amounts_1.plainAmount)(order.subtotal) || subtotalFromLines,
            tax: (0, klaviyo_order_amounts_1.plainAmount)(order.tax_total),
            currency: order.currency_code,
            shipping: (0, klaviyo_order_amounts_1.plainAmount)(order.shipping_total),
            discount_total: (0, klaviyo_order_amounts_1.plainAmount)(order.discount_total),
            discount_codes,
            ...campaignProps,
            items,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1vcmRlci1ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvc2VuZC1vcmRlci1ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFFQUE0RTtBQUU1RSxpREFBcUU7QUFDckUsMkVBSXdDO0FBQ3hDLHFGQUFpRjtBQUNqRiw2RUFHcUM7QUFHckMsU0FBUyx1QkFBdUIsQ0FDOUIsS0FBd0I7SUFFeEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQzNFLElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBQ0QsTUFBTSxZQUFZLEdBQ2hCLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQzlFLE9BQU8sWUFBWSxJQUFJLFNBQVMsQ0FBQTtBQUNsQyxDQUFDO0FBRUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLDBCQUFVLEVBQ25DLGtCQUFrQixFQUNsQixLQUFLLEVBQUUsS0FBK0IsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNqRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDWCxPQUFPLElBQUksNEJBQVksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsTUFBTSxjQUFjLEdBQ2xCLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFrQix3QkFBYyxDQUFDLENBQUE7SUFFNUQsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsS0FBSyxDQUFD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