"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const klaviyo_api_1 = require("klaviyo-api");
function formatKlaviyoClientError(error) {
    if (error == null) {
        return "unknown error";
    }
    if (typeof error !== "object") {
        return String(error);
    }
    const parts = [];
    const e = error;
    if (e.message) {
        parts.push(String(e.message));
    }
    if (e.response) {
        const st = e.response.status;
        if (st != null) {
            parts.push(`http_status=${st}`);
        }
        const data = e.response.data;
        if (data !== undefined) {
            try {
                parts.push(typeof data === "string" ? data : JSON.stringify(data));
            }
            catch {
                parts.push(String(data));
            }
        }
    }
    if (e.body !== undefined) {
        try {
            parts.push(typeof e.body === "string" ? e.body : JSON.stringify(e.body));
        }
        catch {
            parts.push(String(e.body));
        }
    }
    return parts.length > 0 ? parts.join(" | ") : String(error);
}
class KlaviyoService {
    constructor({}, options) {
        this.apiKey = options.apiKey;
        this.session = new klaviyo_api_1.ApiKeySession(this.apiKey);
    }
    async upsertProfile(attributes) {
        const profilesApi = new klaviyo_api_1.ProfilesApi(this.session);
        const profile = await profilesApi
            .createOrUpdateProfile({
            data: {
                type: klaviyo_api_1.ProfileEnum.Profile,
                attributes,
            },
        })
            .then(({ body }) => body);
        return profile;
    }
    async createEvent(eventPayload) {
        const eventsApi = new klaviyo_api_1.EventsApi(this.session);
        const event = await eventsApi
            .createEvent({
            data: {
                type: "event",
                attributes: eventPayload,
            },
        })
            .then(({ body }) => body);
        return event;
    }
    async bulkSubscribeProfiles(payload) {
        try {
            const profilesApi = new klaviyo_api_1.ProfilesApi(this.session);
            // Format according to the SDK's expected structure
            const subscriptionJobPayload = {
                data: {
                    type: klaviyo_api_1.ProfileSubscriptionBulkCreateJobEnum.ProfileSubscriptionBulkCreateJob,
                    attributes: {
                        profiles: {
                            data: payload,
                        },
                        customSource: "medusa-klaviyo-integration",
                    },
                },
            };
            const res = await profilesApi
                .bulkSubscribeProfiles(subscriptionJobPayload)
                .catch((error) => {
                const detail = formatKlaviyoClientError(error);
                console.error("Klaviyo bulkSubscribeProfiles failed:", detail, error);
                throw new Error(`Error bulk subscribing profiles to Klaviyo: ${detail}`);
            });
            // klaviyo-api: bulkSubscribeProfiles omits body assignment (unlike bulkImportProfiles).
            // Success still returns 200/202 with JSON in axios response.data.
            let resolvedBody = res.body !== undefined && res.body !== null
                ? res.body
                : res.response?.data;
            if (typeof resolvedBody === "string") {
                const trimmed = resolvedBody.trim();
                if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                    try {
                        resolvedBody = JSON.parse(trimmed);
                    }
                    catch {
                        /* leave as string for callers / logs */
                    }
                }
            }
            return resolvedBody;
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.startsWith("Error bulk subscribing profiles to Klaviyo:")) {
                throw error;
            }
            const detail = formatKlaviyoClientError(error);
            console.error("Klaviyo bulkSubscribeProfiles failed:", detail, error);
            throw new Error(`Error bulk subscribing profiles to Klaviyo: ${detail}`);
        }
    }
}
exports.default = KlaviyoService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2tsYXZpeW8vc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQVNxQjtBQU1yQixTQUFTLHdCQUF3QixDQUFDLEtBQWM7SUFDOUMsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDOUIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNELE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsR0FBRyxLQUlULENBQUM7SUFDRixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNmLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzdCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQztnQkFDSCxLQUFLLENBQUMsSUFBSSxDQUNSLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUN2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