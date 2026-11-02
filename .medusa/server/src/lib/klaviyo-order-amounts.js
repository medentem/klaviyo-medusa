"use strict";
/**
 * query.graph money and quantity values are numbers, numeric strings, or
 * BigNumber JSON (`{ value, precision }` / `{ numeric }`). Klaviyo drops
 * undefined keys, so a missing line quantity never appears on the event.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plainAmount = plainAmount;
exports.lineQuantity = lineQuantity;
exports.orderGrandTotal = orderGrandTotal;
function plainAmount(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim() !== "") {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }
    if (value && typeof value === "object") {
        const record = value;
        if (typeof record.numeric === "number" && Number.isFinite(record.numeric)) {
            return record.numeric;
        }
        if ("value" in record) {
            return plainAmount(record.value);
        }
    }
    return 0;
}
function lineQuantity(item) {
    const detail = item.detail && typeof item.detail === "object"
        ? item.detail
        : undefined;
    const raw = item.raw_quantity ??
        detail?.raw_quantity ??
        item.quantity ??
        detail?.quantity;
    const n = plainAmount(raw);
    if (n > 0) {
        return Math.round(n);
    }
    return 0;
}
function summaryRecord(summary) {
    if (!summary) {
        return null;
    }
    if (Array.isArray(summary)) {
        return summaryRecord(summary[0]);
    }
    if (typeof summary !== "object") {
        return null;
    }
    const record = summary;
    if (record.totals && typeof record.totals === "object") {
        return record.totals;
    }
    return record;
}
/** Prefer a computed total. If that is 0, use the persisted order summary. */
function orderGrandTotal(order) {
    const computed = plainAmount(order.total);
    if (computed !== 0) {
        return computed;
    }
    const summary = summaryRecord(order.summary);
    if (!summary) {
        return 0;
    }
    return (plainAmount(summary.raw_current_order_total) ||
        plainAmount(summary.current_order_total) ||
        plainAmount(summary.raw_original_order_total) ||
        plainAmount(summary.original_order_total) ||
        0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1vcmRlci1hbW91bnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9rbGF2aXlvLW9yZGVyLWFtb3VudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBRUgsa0NBa0JDO0FBRUQsb0NBZUM7QUFvQkQsMENBbUJDO0FBMUVELFNBQWdCLFdBQVcsQ0FBQyxLQUFjO0lBQ3hDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN4RCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDckQsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZCLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUNELElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLEtBQWdDLENBQUE7UUFDL0MsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDMUUsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxJQUFJLE9BQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUN0QixPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBQTtBQUNWLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsSUFBNkI7SUFDeEQsTUFBTSxNQUFNLEdBQ1YsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUTtRQUM1QyxDQUFDLENBQUUsSUFBSSxDQUFDLE1BQWtDO1FBQzFDLENBQUMsQ0FBQyxTQUFTLENBQUE7SUFDZixNQUFNLEdBQUcsR0FDUCxJQUFJLENBQUMsWUFBWTtRQUNqQixNQUFNLEVBQUUsWUFBWTtRQUNwQixJQUFJLENBQUMsUUFBUTtRQUNiLE1BQU0sRUFBRSxRQUFRLENBQUE7SUFDbEIsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFDRCxPQUFPLENBQUMsQ0FBQTtBQUNWLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxPQUFnQjtJQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUMzQixPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQ0QsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFDRCxNQUFNLE1BQU0sR0FBRyxPQUFrQyxDQUFBO0lBQ2pELElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDdkQsT0FBTyxNQUFNLENBQUMsTUFBaUMsQ0FBQTtJQUNqRCxDQUFDO0lBQ0QsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDO0FBRUQsOEVBQThFO0FBQzlFLFNBQWdCLGVBQWUsQ0FBQyxLQUcvQjtJQUNDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDekMsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbkIsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQztJQUNELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLENBQUE7SUFDVixDQUFDO0lBQ0QsT0FBTyxDQUNMLFdBQVcsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7UUFDNUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztRQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDO1FBQzdDLFdBQVcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7UUFDekMsQ0FBQyxDQUNGLENBQUE7QUFDSCxDQUFDIn0=