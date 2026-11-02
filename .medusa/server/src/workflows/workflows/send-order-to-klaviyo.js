"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderToKlaviyoWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const steps_1 = require("../steps");
exports.sendOrderToKlaviyoWorkflow = (0, workflows_sdk_1.createWorkflow)("send-order-to-klaviyo", (input) => {
    const order = (0, steps_1.loadOrderForKlaviyoStep)({ orderId: input.orderId });
    const result = (0, steps_1.sendOrderEventStep)(order);
    return new workflows_sdk_1.WorkflowResponse({
        result,
    });
});
exports.default = exports.sendOrderToKlaviyoWorkflow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZC1vcmRlci10by1rbGF2aXlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy93b3JrZmxvd3Mvc2VuZC1vcmRlci10by1rbGF2aXlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUcwQztBQUMxQyxvQ0FBc0U7QUFVekQsUUFBQSwwQkFBMEIsR0FBRyxJQUFBLDhCQUFjLEVBQ3RELHVCQUF1QixFQUN2QixDQUFDLEtBQW9CLEVBQW9DLEVBQUU7SUFDekQsTUFBTSxLQUFLLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFBLDBCQUFrQixFQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXhDLE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQztRQUMxQixNQUFNO0tBQ1AsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUNGLENBQUE7QUFFRCxrQkFBZSxrQ0FBMEIsQ0FBQSJ9