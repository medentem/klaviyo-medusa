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
 * Same semantics as criterion-barrels `collectPromotionCampaignFromPromotionRows`
 * (plugin cannot import the storefront/server app package).
 */
function collectPromotionCampaignFromGraphPromotionRows(
  promotions: unknown
): { ids: string[]; identifiers: string[] } {
  const idSet = new Set<string>()
  const identSet = new Set<string>()
  if (!Array.isArray(promotions)) {
    return { ids: [], identifiers: [] }
  }
  for (const row of promotions) {
    if (!row || typeof row !== "object") {
      continue
    }
    const r = row as Record<string, unknown>
    const c = r.campaign
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const o = c as Record<string, unknown>
      const id = o.id
      if (typeof id === "string" && id.trim()) {
        idSet.add(id.trim())
      }
      const ci = o.campaign_identifier
      if (typeof ci === "string" && ci.trim()) {
        identSet.add(ci.trim())
      }
    } else {
      const cid = r.campaign_id
      if (typeof cid === "string" && cid.trim()) {
        idSet.add(cid.trim())
      }
    }
  }
  return {
    ids: Array.from(idSet).sort(),
    identifiers: Array.from(identSet).sort(),
  }
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

type MetadataCampaignFields = {
  coupon_campaign_name?: string
  coupon_campaign_id?: string
}

function readCouponCampaignMetadataFromOrder(
  order: StoreOrder
): MetadataCampaignFields {
  const meta = order.metadata
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return {}
  }
  const m = meta as Record<string, unknown>
  const name = m.marketing_coupon_campaign
  const id = m.marketing_coupon_campaign_id
  const out: MetadataCampaignFields = {}
  if (typeof name === "string" && name.trim()) {
    out.coupon_campaign_name = name.trim()
  }
  if (typeof id === "string" && id.trim()) {
    out.coupon_campaign_id = id.trim()
  }
  return out
}

/**
 * Klaviyo `Placed Order` campaign-related properties: prefer Medusa promotion campaigns
 * from `order.promotions`; if none, fall back to order metadata from marketing links.
 */
export function buildOrderCampaignKlaviyoProperties(
  order: StoreOrder
): Record<string, unknown> {
  const raw = (order as unknown as Record<string, unknown>).promotions
  const { ids, identifiers } = collectPromotionCampaignFromGraphPromotionRows(
    Array.isArray(raw) ? raw : []
  )
  const out: Record<string, unknown> = {}
  if (ids.length) {
    out.promotion_campaign_ids = ids
  }
  if (identifiers.length) {
    out.promotion_campaign_identifiers = identifiers
  }
  if (!ids.length && !identifiers.length) {
    Object.assign(out, readCouponCampaignMetadataFromOrder(order))
  }
  return out
}
