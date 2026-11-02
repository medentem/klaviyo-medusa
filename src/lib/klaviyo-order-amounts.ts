/**
 * query.graph money and quantity values are numbers, numeric strings, or
 * BigNumber JSON (`{ value, precision }` / `{ numeric }`). Klaviyo drops
 * undefined keys, so a missing line quantity never appears on the event.
 */

export function plainAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    if (typeof record.numeric === "number" && Number.isFinite(record.numeric)) {
      return record.numeric
    }
    if ("value" in record) {
      return plainAmount(record.value)
    }
  }
  return 0
}

export function lineQuantity(item: Record<string, unknown>): number {
  const detail =
    item.detail && typeof item.detail === "object"
      ? (item.detail as Record<string, unknown>)
      : undefined
  const raw =
    item.raw_quantity ??
    detail?.raw_quantity ??
    item.quantity ??
    detail?.quantity
  const n = plainAmount(raw)
  if (n > 0) {
    return Math.round(n)
  }
  return 0
}

function summaryRecord(summary: unknown): Record<string, unknown> | null {
  if (!summary) {
    return null
  }
  if (Array.isArray(summary)) {
    return summaryRecord(summary[0])
  }
  if (typeof summary !== "object") {
    return null
  }
  const record = summary as Record<string, unknown>
  if (record.totals && typeof record.totals === "object") {
    return record.totals as Record<string, unknown>
  }
  return record
}

/** Prefer a computed total. If that is 0, use the persisted order summary. */
export function orderGrandTotal(order: {
  total?: unknown
  summary?: unknown
}): number {
  const computed = plainAmount(order.total)
  if (computed !== 0) {
    return computed
  }
  const summary = summaryRecord(order.summary)
  if (!summary) {
    return 0
  }
  return (
    plainAmount(summary.raw_current_order_total) ||
    plainAmount(summary.current_order_total) ||
    plainAmount(summary.raw_original_order_total) ||
    plainAmount(summary.original_order_total) ||
    0
  )
}
