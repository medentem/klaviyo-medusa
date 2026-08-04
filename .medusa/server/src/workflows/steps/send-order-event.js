"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const klaviyo_1 = require("../../types/klaviyo");
const uuid_1 = require("uuid");
const klaviyo_order_promo_fields_1 = require("./klaviyo-order-promo-fields");
const sendOrderEventStep = (0, workflows_sdk_1.createStep)("send-order-event", async (order, context) => {
    const klaviyoService = context.container.resolve(klaviyo_1.KLAVIYO_MODULE);
    // Extract email from the order
    // In Medusa v2, we would need to access the customer email from order data
    const email = order.email;
    // If we don't have customer email information, we can't send the event
    if (!email) {
        return new workflows_sdk_1.StepResponse("No customer email available", null);
    }
    const discount_codes = (0, klaviyo_order_promo_fields_1.collectDiscountCodesForKlaviyo)(order);
    const campaignProps = (0, klaviyo_order_promo_fields_1.buildOrderCampaignKlaviyoProperties)(order);
    // Construct the event payload
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
            items: (order.items || []).map((item) => {
                const meta = item.metadata;
                const displayLines = meta?.product_builder === true && Array.isArray(meta.display_lines)
                    ? meta.display_lines.filter((x) => typeof x === "string" && x.trim().length > 0)
                    : undefined;
                return {
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
                };
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
        unique_id: (0, uuid_1.v4)(),
    };
    // Send the event to Klaviyo
    const event = await klaviyoService.createEvent(eventPayload);
    return new workflows_sdk_1.StepResponse(`Order placed event sent to Klaviyo for order ${order.id}`, event);
});
exports.default = sendOrderEventStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1vcmRlci1ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvc2VuZC1vcmRlci1ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFFQUE2RTtBQUM3RSxpREFBc0U7QUFDdEUsK0JBQW9DO0FBRXBDLDZFQUdzQztBQUV0QyxNQUFNLGtCQUFrQixHQUFHLElBQUEsMEJBQVUsRUFDbkMsa0JBQWtCLEVBQ2xCLEtBQUssRUFBRSxLQUFpQixFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ25DLE1BQU0sY0FBYyxHQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBa0Isd0JBQWMsQ0FBQyxDQUFDO0lBRTdELCtCQUErQjtJQUMvQiwyRUFBMkU7SUFDM0UsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUUxQix1RUFBdUU7SUFDdkUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsT0FBTyxJQUFJLDRCQUFZLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELE1BQU0sY0FBYyxHQUFHLElBQUEsMkRBQThCLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0QsTUFBTSxhQUFhLEdBQUcsSUFBQSxnRUFBbUMsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSw4QkFBOEI7SUFDOUIsTUFBTSxZQUFZLEdBQUc7UUFDbkIsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ3pDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUM3QixRQUFRLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDOUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGNBQWM7WUFDZCxHQUFHLGFBQWE7WUFDaEIsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQXNELENBQUM7Z0JBQ3pFLE1BQU0sWUFBWSxHQUNoQixJQUFJLEVBQUUsZUFBZSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7b0JBQ2pFLENBQUMsQ0FBRSxJQUFJLENBQUMsYUFBMkIsQ0FBQyxNQUFNLENBQ3RDLENBQUMsQ0FBQyxFQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQ2pFO29CQUNILENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ2hCLE9BQU87b0JBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUN0QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQzNCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksU0FBUztvQkFDcEMsZUFBZSxFQUNiLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTTt3QkFDakMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO3dCQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxTQUFTO2lCQUNqQyxDQUFDO1lBQ0osQ0FBQyxDQUFDO1NBQ0g7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxjQUFjO2lCQUNyQjthQUNGO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEtBQUs7aUJBQ047YUFDRjtTQUNGO1FBQ0QsU0FBUyxFQUFFLElBQUEsU0FBTSxHQUFFO0tBQ3BCLENBQUM7SUFFRiw0QkFBNEI7SUFDNUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFjLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTdELE9BQU8sSUFBSSw0QkFBWSxDQUNyQixnREFBZ0QsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUMxRCxLQUFLLENBQ04sQ0FBQztBQUNKLENBQUMsQ0FDRixDQUFDO0FBRUYsa0JBQWUsa0JBQWtCLENBQUMifQ==