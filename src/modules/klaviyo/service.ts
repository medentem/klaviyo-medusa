import {
  ApiKeySession,
  EventsApi,
  ProfileCreateQueryResourceObjectAttributes,
  ProfileEnum,
  ProfilesApi,
  ProfileSubscriptionBulkCreateJobEnum,
  ProfileSubscriptionCreateQueryResourceObject,
  SubscriptionCreateJobCreateQuery,
} from "klaviyo-api";

type ModuleOptions = {
  apiKey: string;
};

function formatKlaviyoClientError(error: unknown): string {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error !== "object") {
    return String(error);
  }
  const parts: string[] = [];
  const e = error as Record<string, unknown> & {
    message?: string;
    response?: { status?: number; data?: unknown };
    body?: unknown;
  };
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
        parts.push(
          typeof data === "string" ? data : JSON.stringify(data)
        );
      } catch {
        parts.push(String(data));
      }
    }
  }
  if (e.body !== undefined) {
    try {
      parts.push(
        typeof e.body === "string" ? e.body : JSON.stringify(e.body)
      );
    } catch {
      parts.push(String(e.body));
    }
  }
  return parts.length > 0 ? parts.join(" | ") : String(error);
}

class KlaviyoService {
  private readonly apiKey: string;
  private readonly session: ApiKeySession;

  constructor({}, options: ModuleOptions) {
    this.apiKey = options.apiKey;

    this.session = new ApiKeySession(this.apiKey);
  }

  async upsertProfile(attributes: ProfileCreateQueryResourceObjectAttributes) {
    const profilesApi = new ProfilesApi(this.session);
    const profile = await profilesApi
      .createOrUpdateProfile({
        data: {
          type: ProfileEnum.Profile,
          attributes,
        },
      })
      .then(({ body }) => body);

    return profile;
  }

  async createEvent(eventPayload: any) {
    const eventsApi = new EventsApi(this.session);
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

  async bulkSubscribeProfiles(
    payload: ProfileSubscriptionCreateQueryResourceObject[]
  ) {
    try {
      const profilesApi = new ProfilesApi(this.session);

      // Format according to the SDK's expected structure
      const subscriptionJobPayload: SubscriptionCreateJobCreateQuery = {
        data: {
          type: ProfileSubscriptionBulkCreateJobEnum.ProfileSubscriptionBulkCreateJob,
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
          throw new Error(
            `Error bulk subscribing profiles to Klaviyo: ${detail}`
          );
        });

      // klaviyo-api: bulkSubscribeProfiles omits body assignment (unlike bulkImportProfiles).
      // Success still returns 200/202 with JSON in axios response.data.
      const payload =
        res.body !== undefined && res.body !== null
          ? res.body
          : res.response?.data;

      return payload;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Error bulk subscribing profiles to Klaviyo:")
      ) {
        throw error;
      }
      const detail = formatKlaviyoClientError(error);
      console.error("Klaviyo bulkSubscribeProfiles failed:", detail, error);
      throw new Error(
        `Error bulk subscribing profiles to Klaviyo: ${detail}`
      );
    }
  }
}

export default KlaviyoService;
