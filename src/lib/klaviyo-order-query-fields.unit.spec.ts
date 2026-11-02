import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  KLAVIYO_PLACED_ORDER_FIELDS,
  klaviyoPlacedOrderUniqueId,
} from "./klaviyo-order-query-fields.ts"

describe("KLAVIYO_PLACED_ORDER_FIELDS", () => {
  it("selects an explicit shipping method id so Medusa 2.18 loads version", () => {
    assert.ok(
      KLAVIYO_PLACED_ORDER_FIELDS.includes("shipping_methods.shipping_method.id")
    )
  })

  it("does not use shipping method wildcards that omit order_shipping.version", () => {
    const forbidden = [
      "*",
      "shipping_methods.*",
      "shipping_methods.shipping_method.*",
      "shipping_methods.adjustments.*",
    ]
    for (const field of forbidden) {
      assert.equal(
        KLAVIYO_PLACED_ORDER_FIELDS.includes(
          field as (typeof KLAVIYO_PLACED_ORDER_FIELDS)[number]
        ),
        false,
        field
      )
    }
  })
})

describe("klaviyoPlacedOrderUniqueId", () => {
  it("is stable for an order id", () => {
    assert.equal(
      klaviyoPlacedOrderUniqueId("order_123"),
      "placed-order-order_123"
    )
    assert.equal(
      klaviyoPlacedOrderUniqueId("order_123"),
      klaviyoPlacedOrderUniqueId("order_123")
    )
  })
})
