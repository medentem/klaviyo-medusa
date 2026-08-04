"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderToKlaviyoWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const steps_1 = require("../steps");
exports.sendOrderToKlaviyoWorkflow = (0, workflows_sdk_1.createWorkflow)("send-order-to-klaviyo", (input) => {
    const { order } = input;
    // Send order event to Klaviyo
    const result = (0, steps_1.sendOrderEventStep)(order);
    return new workflows_sdk_1.WorkflowResponse({
        result,
    });
});
exports.default = exports.sendOrderToKlaviyoWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1vcmRlci10by1rbGF2aXlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy93b3JrZmxvd3Mvc2VuZC1vcmRlci10by1rbGF2aXlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUcyQztBQUUzQyxvQ0FBOEM7QUFVakMsUUFBQSwwQkFBMEIsR0FBRyxJQUFBLDhCQUFjLEVBQ3RELHVCQUF1QixFQUN2QixDQUFDLEtBQW9CLEVBQW9DLEVBQUU7SUFDekQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQztJQUV4Qiw4QkFBOEI7SUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBQSwwQkFBa0IsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUV6QyxPQUFPLElBQUksZ0NBQWdCLENBQUM7UUFDMUIsTUFBTTtLQUNQLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FDRixDQUFDO0FBRUYsa0JBQWUsa0NBQTBCLENBQUMifQ==