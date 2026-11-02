"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = customerCreatedHandler;
const utils_1 = require("@medusajs/framework/utils");
const workflows_1 = require("../workflows");
async function customerCreatedHandler({ event: { data }, container, }) {
    const customerId = data.id;
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    try {
        const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        const { data: [customer], } = await query.graph({
            entity: "customer",
            fields: ["*"],
            filters: {
                id: customerId,
            },
            pagination: {
                take: 1,
                skip: 0,
            },
        });
        if (!customer) {
            logger.error(`Customer ${customerId} not found`);
            return;
        }
        await (0, workflows_1.syncCustomerToKlaviyoWorkflow)(container).run({
            input: {
                customer,
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to sync customer ${customerId} to Klaviyo: ${message}`);
        throw error;
    }
}
exports.config = {
    event: ["customer.created", "customer.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1jdXN0b21lci1zeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2tsYXZpeW8tY3VzdG9tZXItc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSx5Q0FzQ0M7QUF6Q0QscURBQXFFO0FBQ3JFLDRDQUE0RDtBQUU3QyxLQUFLLFVBQVUsc0JBQXNCLENBQUMsRUFDbkQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ2YsU0FBUyxHQUNzQjtJQUMvQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBQzFCLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFbEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoRSxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQ2pCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3BCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNiLE9BQU8sRUFBRTtnQkFDUCxFQUFFLEVBQUUsVUFBVTthQUNmO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxDQUFDO2FBQ1I7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksVUFBVSxZQUFZLENBQUMsQ0FBQTtZQUNoRCxPQUFNO1FBQ1IsQ0FBQztRQUVELE1BQU0sSUFBQSx5Q0FBNkIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDakQsS0FBSyxFQUFFO2dCQUNMLFFBQVE7YUFDVDtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxPQUFPLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFVBQVUsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDNUUsTUFBTSxLQUFLLENBQUE7SUFDYixDQUFDO0FBQ0gsQ0FBQztBQUVZLFFBQUEsTUFBTSxHQUFxQjtJQUN0QyxLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQztDQUNoRCxDQUFBIn0=