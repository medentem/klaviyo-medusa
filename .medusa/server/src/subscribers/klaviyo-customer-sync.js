"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = customerCreatedHandler;
const workflows_1 = require("../workflows");
async function customerCreatedHandler({ event: { data }, container, }) {
    const customerId = data.id;
    try {
        const query = container.resolve("query");
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
            console.error(`Customer ${customerId} not found`);
            return;
        }
        await (0, workflows_1.syncCustomerToKlaviyoWorkflow)(container).run({
            input: {
                customer,
            },
        });
    }
    catch (error) {
        console.error(`Failed to sync customer ${customerId} to Klaviyo:`, error);
    }
}
exports.config = {
    event: ["customer.created", "customer.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1jdXN0b21lci1zeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2tsYXZpeW8tY3VzdG9tZXItc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFNQSx5Q0FtQ0M7QUFyQ0QsNENBQTZEO0FBRTlDLEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxFQUNuRCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFDZixTQUFTLEdBQ3NCO0lBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFM0IsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQ2pCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3BCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNiLE9BQU8sRUFBRTtnQkFDUCxFQUFFLEVBQUUsVUFBVTthQUNmO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxDQUFDO2FBQ1I7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksVUFBVSxZQUFZLENBQUMsQ0FBQztZQUNsRCxPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sSUFBQSx5Q0FBNkIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDakQsS0FBSyxFQUFFO2dCQUNMLFFBQVE7YUFDVDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsVUFBVSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUUsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUM7Q0FDaEQsQ0FBQyJ9