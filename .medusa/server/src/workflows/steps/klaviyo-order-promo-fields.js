"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDiscountCodesForKlaviyo = collectDiscountCodesForKlaviyo;
exports.buildOrderCampaignKlaviyoProperties = buildOrderCampaignKlaviyoProperties;
function collectCodesFromAdjustments(order) {
    const codes = new Set();
    for (const item of order.items ?? []) {
        if (!item) {
            continue;
        }
        for (const adj of item.adjustments ?? []) {
            const c = adj?.code?.trim();
            if (c) {
                codes.add(c);
            }
        }
    }
    for (const sm of order.shipping_methods ?? []) {
        if (!sm) {
            continue;
        }
        for (const adj of sm.adjustments ?? []) {
            const c = adj?.code?.trim();
            if (c) {
                codes.add(c);
            }
        }
    }
    return codes;
}
function collectCodesFromPromotionsRelation(order) {
    const codes = new Set();
    const raw = order.promotions;
    if (!Array.isArray(raw)) {
        return codes;
    }
    for (const row of raw) {
        if (!row || typeof row !== "object") {
            continue;
        }
        const code = row.code;
        if (typeof code === "string" && code.trim()) {
            codes.add(code.trim());
        }
    }
    return codes;
}
/**
 * Same semantics as criterion-barrels `collectPromotionCampaignFromPromotionRows`
 * (plugin cannot import the storefront/server app package).
 */
function collectPromotionCampaignFromGraphPromotionRows(promotions) {
    const idSet = new Set();
    const identSet = new Set();
    if (!Array.isArray(promotions)) {
        return { ids: [], identifiers: [] };
    }
    for (const row of promotions) {
        if (!row || typeof row !== "object") {
            continue;
        }
        const r = row;
        const c = r.campaign;
        if (c && typeof c === "object" && !Array.isArray(c)) {
            const o = c;
            const id = o.id;
            if (typeof id === "string" && id.trim()) {
                idSet.add(id.trim());
            }
            const ci = o.campaign_identifier;
            if (typeof ci === "string" && ci.trim()) {
                identSet.add(ci.trim());
            }
        }
        else {
            const cid = r.campaign_id;
            if (typeof cid === "string" && cid.trim()) {
                idSet.add(cid.trim());
            }
        }
    }
    return {
        ids: Array.from(idSet).sort(),
        identifiers: Array.from(identSet).sort(),
    };
}
/**
 * Discount / promotion codes for Klaviyo `discount_codes` (line + shipping adjustments
 * and, when present on the graph, `promotions.code`).
 */
function collectDiscountCodesForKlaviyo(order) {
    const codes = collectCodesFromAdjustments(order);
    for (const c of collectCodesFromPromotionsRelation(order)) {
        codes.add(c);
    }
    return [...codes].sort();
}
function readCouponCampaignMetadataFromOrder(order) {
    const meta = order.metadata;
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
        return {};
    }
    const m = meta;
    const name = m.marketing_coupon_campaign;
    const id = m.marketing_coupon_campaign_id;
    const out = {};
    if (typeof name === "string" && name.trim()) {
        out.coupon_campaign_name = name.trim();
    }
    if (typeof id === "string" && id.trim()) {
        out.coupon_campaign_id = id.trim();
    }
    return out;
}
/**
 * Klaviyo `Placed Order` campaign-related properties: prefer Medusa promotion campaigns
 * from `order.promotions`; if none, fall back to order metadata from marketing links.
 */
function buildOrderCampaignKlaviyoProperties(order) {
    const raw = order.promotions;
    const { ids, identifiers } = collectPromotionCampaignFromGraphPromotionRows(Array.isArray(raw) ? raw : []);
    const out = {};
    if (ids.length) {
        out.promotion_campaign_ids = ids;
    }
    if (identifiers.length) {
        out.promotion_campaign_identifiers = identifiers;
    }
    if (!ids.length && !identifiers.length) {
        Object.assign(out, readCouponCampaignMetadataFromOrder(order));
    }
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1wcm9tby1maWVsZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3N0ZXBzL2tsYXZpeW8tb3JkZXItcHJvbW8tZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBNEZBLHdFQU1DO0FBK0JELGtGQWtCQztBQWpKRCxTQUFTLDJCQUEyQixDQUFDLEtBQWlCO0lBQ3BELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7SUFDL0IsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNWLFNBQVE7UUFDVixDQUFDO1FBQ0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUE7WUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDTixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QsS0FBSyxNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLElBQUksRUFBRSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ1IsU0FBUTtRQUNWLENBQUM7UUFDRCxLQUFLLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUM7WUFDdkMsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQTtZQUMzQixJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNOLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDZCxDQUFDO1FB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