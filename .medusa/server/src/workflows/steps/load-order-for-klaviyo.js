"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const klaviyo_order_query_fields_1 = require("../../lib/klaviyo-order-query-fields");
const loadOrderForKlaviyoStep = (0, workflows_sdk_1.createStep)("load-order-for-klaviyo", async (input, context) => {
    const orderId = input.orderId;
    const logger = context.container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = context.container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: [order], } = await query.graph({
        entity: "order",
        fields: [...klaviyo_order_query_fields_1.KLAVIYO_PLACED_ORDER_FIELDS],
        filters: { id: orderId },
        pagination: { take: 1, skip: 0 },
    });
    if (!order) {
        logger.error(`Order ${orderId} not found`);
        return new workflows_sdk_1.StepResponse(null);
    }
    return new workflows_sdk_1.StepResponse(order);
});
exports.default = loadOrderForKlaviyoStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1vcmRlci1mb3Ita2xhdml5by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3RlcHMvbG9hZC1vcmRlci1mb3Ita2xhdml5by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFFQUE0RTtBQUM1RSxxREFBcUU7QUFDckUscUZBQWtGO0FBb0JsRixNQUFNLHVCQUF1QixHQUFHLElBQUEsMEJBQVUsRUFDeEMsd0JBQXdCLEVBQ3hCLEtBQUssRUFBRSxLQUEwQixFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzVDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUE7SUFDN0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDMUUsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFeEUsTUFBTSxFQUNKLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUNkLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLENBQUMsR0FBRyx3REFBMkIsQ0FBQztRQUN4QyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO1FBQ3hCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtLQUNqQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsT0FBTyxZQUFZLENBQUMsQ0FBQTtRQUMxQyxPQUFPLElBQUksNEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQsT0FBTyxJQUFJLDRCQUFZLENBQUMsS0FBMEIsQ0FBQyxDQUFBO0FBQ3JELENBQUMsQ0FDRixDQUFBO0FBRUQsa0JBQWUsdUJBQXVCLENBQUEifQ==