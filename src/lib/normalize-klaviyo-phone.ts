/**
 * Klaviyo `phone_number` on profile subscription payloads must have **no spaces**
 * per the consent API guide. Values should be **E.164** (e.g. `+15005550006`).
 *
 * @see https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api
 */
export function normalizeKlaviyoProfilePhoneNumber(phone: string): string {
  return phone.trim().replace(/\s+/g, "");
}
