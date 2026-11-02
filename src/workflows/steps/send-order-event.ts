import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type { StoreOrder } from "@medusajs/types"
import { IKlaviyoService, KLAVIYO_MODULE } from "../../types/klaviyo"
import {
  lineQuantity,
  orderGrandTotal,
  plainAmount,
} from "../../lib/klaviyo-order-amounts"
import { klaviyoPlacedOrderUniqueId } from "../../lib/klaviyo-order-query-fields"
import {
  buildOrderCampaignKlaviyoProperties,
  collectDiscountCodesForKlaviyo,
} from "./klaviyo-order-promo-fields"
import type { KlaviyoOrderGraph } from "./load-order-for-klaviyo"

function resolvePlacedOrderEmail(
  order: KlaviyoOrderGraph
): string | undefined {
  const fromOrder = typeof order.email === "string" ? order.email.trim() : ""
  if (fromOrder) {
    return fromOrder
  }
  const fromCustomer =
    typeof order.customer?.email === "string" ? order.customer.email.trim() : ""
  return fromCustomer || undefined
}

const sendOrderEventStep = createStep(
  "send-order-event",
  async (order: KlaviyoOrderGraph | null, context) => {
    if (!order) {
      return new StepResponse("Order not found", null)
    }

    const klaviyoService =
      context.container.resolve<IKlaviyoService>(KLAVIYO_MODULE)

    const email = resolvePlacedOrderEmail(order)

    if (!email) {
      return new StepResponse("No customer email available", null)
    }

    const orderForPromos = order as unknown as StoreOrder
    const discount_codes = collectDiscountCodesForKlaviyo(orderForPromos)
    const campaignProps = buildOrderCampaignKlaviyoProperties(orderForPromos)
    const uniqueId = klaviyoPlacedOrderUniqueId(order.id)
    const items = (order.items || []).flatMap((item) => {
      if (!item) {
        return []
      }
      const meta = item.metadata as Record<string, unknown> | null | undefined
      const displayLines =
        meta?.product_builder === true && Array.isArray(meta.display_lines)
          ? (meta.display_lines as unknown[]).filter(
              (x): x is string => typeof x === "string" && x.trim().length > 0
            )
          : undefined
      const quantity = lineQuantity(item)
      const price =
        plainAmount(item.raw_unit_price) || plainAmount(item.unit_price)
      return [
        {
          id: item.variant_id,
          title: item.title,
          quantity,
          price,
          product_id: item.product_id,
          thumbnail: item.thumbnail,
          subtitle: item.subtitle ?? undefined,
          options_summary:
            displayLines && displayLines.length
              ? displayLines.join(" · ")
              : item.subtitle ?? undefined,
        },
      ]
    })
    const subtotalFromLines = items.reduce(
      (sum, item) => sum + plainAmount(item.price) * plainAmount(item.quantity),
      0
    )

    const eventPayload = {
      properties: {
        orderId: order.id,
        orderNumber: order.display_id || order.id,
        total: orderGrandTotal(order),
        subtotal: plainAmount(order.subtotal) || subtotalFromLines,
        tax: plainAmount(order.tax_total),
        currency: order.currency_code,
        shipping: plainAmount(order.shipping_total),
        discount_total: plainAmount(order.discount_total),
        discount_codes,
        ...campaignProps,
        items,
      },
      metric: {
        data: {
          type: "metric",
          attributes: {
            name: "Placed Order",
          },
        },
      },
      profile: {
        data: {
          type: "profile",
          attributes: {
            email,
          },
        },
      },
      unique_id: uniqueId,
    }

    const event = await klaviyoService.createEvent(eventPayload)

    return new StepResponse(
      `Order placed event sent to Klaviyo for order ${order.id} (unique_id=${uniqueId})`,
      event
    )
  }
)

export default sendOrderEventStep
