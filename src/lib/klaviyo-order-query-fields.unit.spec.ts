import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  lineQuantity,
  orderGrandTotal,
  plainAmount,
} from "./klaviyo-order-amounts.ts"
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

  it("loads line quantity, shipping amount, and the persisted summary", () => {
    for (const field of [
      "items.detail.quantity",
      "shipping_methods.amount",
      "summary",
    ]) {
      assert.ok(
        KLAVIYO_PLACED_ORDER_FIELDS.includes(
          field as (typeof KLAVIYO_PLACED_ORDER_FIELDS)[number]
        ),
        field
      )
    }
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

describe("order amounts", () => {
  it("reads quantity from the order-item detail when the line item has none", () => {
    assert.equal(
      lineQuantity({
        unit_price: 329.99,
        detail: { raw_quantity: { value: "1", precision: 20 } },
      }),
      1
    )
  })

  it("uses the persisted summary when the computed total is 0", () => {
    assert.equal(plainAmount({ value: "329.99", precision: 20 }), 329.99)
    assert.equal(
      orderGrandTotal({
        total: 0,
        summary: { current_order_total: 329.99 },
      }),
      329.99
    )
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
