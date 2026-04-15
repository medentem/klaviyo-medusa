/**
 * Gates Klaviyo **SMS** subscription flows (marketing + transactional) in this package.
 * Email marketing consent is unaffected.
 *
 * Set `KLAVIYO_SMS_ENABLED=true` in the Medusa process environment when launching SMS.
 */
export function klaviyoSmsEnabledFromEnv(): boolean {
  return process.env.KLAVIYO_SMS_ENABLED === "true";
}
