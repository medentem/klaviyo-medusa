"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const workflows_1 = require("../workflows");
async function orderPlacedHandler({ event: { data }, container, }) {
    const orderId = data.id;
    try {
        const query = container.resolve("query");
        const { data: [order], } = await query.graph({
            entity: "order",
            fields: [
                "*",
                "items.*",
                "items.adjustments.*",
                "shipping_methods.*",
                "shipping_methods.adjustments.*",
                "shipping_address.*",
                "billing_address.*",
                "customer.email",
                "metadata",
                "promotions.code",
                "promotions.metadata",
                "promotions.campaign_id",
                "promotions.campaign.id",
                "promotions.campaign.campaign_identifier",
                "promotions.campaign.name",
            ],
            filters: {
                id: orderId,
            },
            pagination: {
                take: 1,
                skip: 0,
            },
        });
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }
        await (0, workflows_1.sendOrderToKlaviyoWorkflow)(container).run({
            input: {
                order,
            },
        });
    }
    catch (error) {
        console.error(`Failed to send order ${orderId} to Klaviyo:`, error);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2tsYXZpeW8tb3JkZXItY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSxxQ0FtREM7QUFyREQsNENBQTBEO0FBRTNDLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUMvQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFDZixTQUFTLEdBQ3NCO0lBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFeEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQ2QsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDcEIsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sR0FBRztnQkFDSCxTQUFTO2dCQUNULHFCQUFxQjtnQkFDckIsb0JBQW9CO2dCQUNwQixnQ0FBZ0M7Z0JBQ2hDLG9CQUFvQjtnQkFDcEIsbUJBQW1CO2dCQUNuQixnQkFBZ0I7Z0JBQ2hCLFVBQVU7Z0JBQ1YsaUJBQWlCO2dCQUNqQixxQkFBcUI7Z0JBQ3JCLHdCQUF3QjtnQkFDeEIsd0JBQXdCO2dCQUN4Qix5Q0FBeUM7Z0JBQ3pDLDBCQUEwQjthQUMzQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxFQUFFLEVBQUUsT0FBTzthQUNaO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxDQUFDO2FBQ1I7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsT0FBTyxZQUFZLENBQUMsQ0FBQztZQUM1QyxPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sSUFBQSxzQ0FBMEIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDOUMsS0FBSyxFQUFFO2dCQUNMLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsT0FBTyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEUsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLGNBQWM7Q0FDdEIsQ0FBQyJ9