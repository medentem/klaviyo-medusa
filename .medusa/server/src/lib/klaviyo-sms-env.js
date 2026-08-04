"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.klaviyoSmsEnabledFromEnv = klaviyoSmsEnabledFromEnv;
/**
 * Gates Klaviyo **SMS** subscription flows (marketing + transactional) in this package.
 * Email marketing consent is unaffected.
 *
 * Set `KLAVIYO_SMS_ENABLED=true` in the Medusa process environment when launching SMS.
 */
function klaviyoSmsEnabledFromEnv() {
    return process.env.KLAVIYO_SMS_ENABLED === "true";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2xhdml5by1zbXMtZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9rbGF2aXlvLXNtcy1lbnYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSw0REFFQztBQVJEOzs7OztHQUtHO0FBQ0gsU0FBZ0Isd0JBQXdCO0lBQ3RDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsS0FBSyxNQUFNLENBQUM7QUFDcEQsQ0FBQyJ9