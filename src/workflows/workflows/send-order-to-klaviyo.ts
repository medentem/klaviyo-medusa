import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { loadOrderForKlaviyoStep, sendOrderEventStep } from "../steps"

type WorkflowInput = {
  orderId: string
}

type WorkflowOutput = {
  result: string
}

export const sendOrderToKlaviyoWorkflow = createWorkflow(
  "send-order-to-klaviyo",
  (input: WorkflowInput): WorkflowResponse<WorkflowOutput> => {
    const order = loadOrderForKlaviyoStep({ orderId: input.orderId })
    const result = sendOrderEventStep(order)

    return new WorkflowResponse({
      result,
    })
  }
)

export default sendOrderToKlaviyoWorkflow
