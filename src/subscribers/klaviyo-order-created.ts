import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sendOrderToKlaviyoWorkflow } from "../workflows"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    await sendOrderToKlaviyoWorkflow(container).run({
      input: {
        orderId,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to send order ${orderId} to Klaviyo: ${message}`)
    throw error
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
