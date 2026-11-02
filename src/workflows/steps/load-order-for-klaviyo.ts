import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { KLAVIYO_PLACED_ORDER_FIELDS } from "../../lib/klaviyo-order-query-fields"

export type KlaviyoOrderGraph = {
  id: string
  display_id?: number | string | null
  email?: string | null
  currency_code?: string | null
  total?: unknown
  subtotal?: unknown
  tax_total?: unknown
  shipping_total?: unknown
  discount_total?: unknown
  summary?: unknown
  metadata?: Record<string, unknown> | null
  customer?: { email?: string | null } | null
  items?: Array<Record<string, unknown> | null> | null
  shipping_methods?: Array<Record<string, unknown> | null> | null
  promotions?: unknown
}

const loadOrderForKlaviyoStep = createStep(
  "load-order-for-klaviyo",
  async (input: { orderId: string }, context) => {
    const orderId = input.orderId
    const logger = context.container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = context.container.resolve(ContainerRegistrationKeys.QUERY)

    const {
      data: [order],
    } = await query.graph({
      entity: "order",
      fields: [...KLAVIYO_PLACED_ORDER_FIELDS],
      filters: { id: orderId },
      pagination: { take: 1, skip: 0 },
    })

    if (!order) {
      logger.error(`Order ${orderId} not found`)
      return new StepResponse(null)
    }

    return new StepResponse(order as KlaviyoOrderGraph)
  }
)

export default loadOrderForKlaviyoStep
