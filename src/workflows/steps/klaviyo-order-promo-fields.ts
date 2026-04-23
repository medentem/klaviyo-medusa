import type { StoreOrder } from "@medusajs/types";

function collectCodesFromAdjustments(order: StoreOrder): Set<string> {
  const codes = new Set<string>()
  for (const item of order.items ?? []) {
    if (!item) {
      continue
    }
    for (const adj of item.adjustments ?? []) {
      const c = adj?.code?.trim()
      if (c) {
        codes.add(c)
      }
    }
  }
  for (const sm of order.shipping_methods ?? []) {
    if (!sm) {
      continue
    }
    for (const adj of sm.adjustments ?? []) {
      const c = adj?.code?.trim()
      if (c) {
        codes.add(c)
      }
    }
  }
  return codes
}

function collectCodesFromPromotionsRelation(order: StoreOrder): Set<string> {
  const codes = new Set<string>()
  const raw = (order as unknown as Record<string, unknown>).promotions
  if (!Array.isArray(raw)) {
    return codes
  }
  for (const row of raw) {
    if (!row || typeof row !== "object") {
      continue
    }
    const code = (row as Record<string, unknown>).code
    if (typeof code === "string" && code.trim()) {
      codes.add(code.trim())
    }
  }
  return codes
}

/**
 * Discount / promotion codes for Klaviyo `discount_codes` (line + shipping adjustments
 * and, when present on the graph, `promotions.code`).
 */
export function collectDiscountCodesForKlaviyo(order: StoreOrder): string[] {
  const codes = collectCodesFromAdjustments(order)
  for (const c of collectCodesFromPromotionsRelation(order)) {
    codes.add(c)
  }
  return [...codes].sort()
}

type CampaignFields = {
  coupon_campaign_name?: string
  coupon_campaign_id?: string
}

/**
 * Reads `metadata.marketing_coupon_campaign` (+ optional `_id`) from the order, set by
 * the storefront when shoppers use marketing promo links.
 */
export function readCouponCampaignFieldsForKlaviyo(
  order: StoreOrder
): CampaignFields {
  const meta = order.metadata
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return {}
  }
  const m = meta as Record<string, unknown>
  const name = m.marketing_coupon_campaign
  const id = m.marketing_coupon_campaign_id
  const out: CampaignFields = {}
  if (typeof name === "string" && name.trim()) {
    out.coupon_campaign_name = name.trim()
  }
  if (typeof id === "string" && id.trim()) {
    out.coupon_campaign_id = id.trim()
  }
  return out
}
