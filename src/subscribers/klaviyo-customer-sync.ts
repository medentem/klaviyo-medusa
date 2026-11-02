import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { syncCustomerToKlaviyoWorkflow } from "../workflows"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = data.id
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const {
      data: [customer],
    } = await query.graph({
      entity: "customer",
      fields: ["*"],
      filters: {
        id: customerId,
      },
      pagination: {
        take: 1,
        skip: 0,
      },
    })

    if (!customer) {
      logger.error(`Customer ${customerId} not found`)
      return
    }

    await syncCustomerToKlaviyoWorkflow(container).run({
      input: {
        customer,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to sync customer ${customerId} to Klaviyo: ${message}`)
    throw error
  }
}

export const config: SubscriberConfig = {
  event: ["customer.created", "customer.updated"],
}
