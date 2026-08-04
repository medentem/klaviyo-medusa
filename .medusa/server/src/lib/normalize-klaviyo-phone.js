"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeKlaviyoProfilePhoneNumber = normalizeKlaviyoProfilePhoneNumber;
/**
 * Klaviyo `phone_number` on profile subscription payloads must have **no spaces**
 * per the consent API guide. Values should be **E.164** (e.g. `+15005550006`).
 *
 * @see https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api
 */
function normalizeKlaviyoProfilePhoneNumber(phone) {
    return phone.trim().replace(/\s+/g, "");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplLWtsYXZpeW8tcGhvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL25vcm1hbGl6ZS1rbGF2aXlvLXBob25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsZ0ZBRUM7QUFSRDs7Ozs7R0FLRztBQUNILFNBQWdCLGtDQUFrQyxDQUFDLEtBQWE7SUFDOUQsT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxDQUFDIn0=