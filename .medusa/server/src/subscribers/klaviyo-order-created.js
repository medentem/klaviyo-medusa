"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const utils_1 = require("@medusajs/framework/utils");
const workflows_1 = require("../workflows");
async function orderPlacedHandler({ event: { data }, container, }) {
    const orderId = data.id;
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    try {
        await (0, workflows_1.sendOrderToKlaviyoWorkflow)(container).run({
            input: {
                orderId,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to send order ${orderId} to Klaviyo: ${message}`);
        throw error;
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2tsYXZpeW8tb3JkZXItY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxxQ0FrQkM7QUFyQkQscURBQXFFO0FBQ3JFLDRDQUF5RDtBQUUxQyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFDL0MsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ2YsU0FBUyxHQUNzQjtJQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFbEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxJQUFBLHNDQUEwQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUM5QyxLQUFLLEVBQUU7Z0JBQ0wsT0FBTzthQUNSO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLE9BQU8sR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdEUsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsT0FBTyxnQkFBZ0IsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUN0RSxNQUFNLEtBQUssQ0FBQTtJQUNiLENBQUM7QUFDSCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxjQUFjO0NBQ3RCLENBQUEifQ==