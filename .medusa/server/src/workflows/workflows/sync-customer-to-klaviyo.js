"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCustomerToKlaviyoWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const normalize_klaviyo_phone_1 = require("../../lib/normalize-klaviyo-phone");
const steps_1 = require("../steps");
exports.syncCustomerToKlaviyoWorkflow = (0, workflows_sdk_1.createWorkflow)("sync-customer-to-klaviyo", (input) => {
    const { customer } = input;
    // Construct attributes for Klaviyo profile
    const attributes = (0, workflows_sdk_1.transform)(customer, (customer) => {
        const raw = typeof customer.phone === "string" && customer.phone.trim()
            ? customer.phone
            : "";
        return {
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            ...(raw ? { phoneNumber: (0, normalize_klaviyo_phone_1.normalizeKlaviyoProfilePhoneNumber)(raw) } : {}),
            externalId: customer.id,
            properties: {
                medusa_customer_id: customer.id,
                created_at: customer.created_at,
            },
        };
    });
    // Create or update profile in Klaviyo
    const profile = (0, steps_1.syncCustomerProfileStep)(attributes);
    // Process consent data if available and subscribe the customer
    const subscriptionResult = (0, steps_1.handleCustomerConsentStep)({
        profileId: profile.data.id,
        customer,
    });
    return new workflows_sdk_1.WorkflowResponse({
        profile,
        subscriptionResult,
    });
});
exports.default = exports.syncCustomerToKlaviyoWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1jdXN0b21lci10by1rbGF2aXlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy93b3JrZmxvd3Mvc3luYy1jdXN0b21lci10by1rbGF2aXlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHFFQUkyQztBQUszQywrRUFBdUY7QUFDdkYsb0NBQThFO0FBV2pFLFFBQUEsNkJBQTZCLEdBQUcsSUFBQSw4QkFBYyxFQUN6RCwwQkFBMEIsRUFDMUIsQ0FBQyxLQUFvQixFQUFvQyxFQUFFO0lBQ3pELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFM0IsMkNBQTJDO0lBQzNDLE1BQU0sVUFBVSxHQUErQyxJQUFBLHlCQUFTLEVBQ3RFLFFBQVEsRUFDUixDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQ1gsTUFBTSxHQUFHLEdBQ1AsT0FBTyxRQUFRLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUN6RCxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUs7WUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNULE9BQU87WUFDTCxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7WUFDckIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxVQUFVO1lBQzlCLFFBQVEsRUFBRSxRQUFRLENBQUMsU0FBUztZQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFBLDREQUFrQyxFQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN4RSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDdkIsVUFBVSxFQUFFO2dCQUNWLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxFQUFFO2dCQUMvQixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7YUFDaEM7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUNGLENBQUM7SUFFRixzQ0FBc0M7SUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxVQUFVLENBQUMsQ0FBQztJQUVwRCwrREFBK0Q7SUFDL0QsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLGlDQUF5QixFQUFDO1FBQ25ELFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUIsUUFBUTtLQUNULENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQztRQUMxQixPQUFPO1FBQ1Asa0JBQWtCO0tBQ25CLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FDRixDQUFDO0FBRUYsa0JBQWUscUNBQTZCLENBQUMifQ==