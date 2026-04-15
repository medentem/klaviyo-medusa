import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CustomerDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  IKlaviyoService,
  KLAVIYO_MODULE,
  KlaviyoConsent,
} from "../../types/klaviyo";
import {
  SubscriptionChannels,
  SubscriptionParameters,
} from "klaviyo-api";
import { normalizeKlaviyoProfilePhoneNumber } from "../../lib/normalize-klaviyo-phone";

/**
 * Subscribes via Klaviyo **Bulk Subscribe Profiles** (`POST /api/profile-subscription-bulk-create-jobs`).
 *
 * @see https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles
 * @see https://developers.klaviyo.com/en/docs/collect_email_and_sms_consent_via_api
 *
 * OpenAPI `ProfileSubscriptionCreateQueryResourceObject.attributes`:
 * - `subscriptions` is required (`SubscriptionChannels` with `email` / `sms` etc.).
 * - `phone_number` on the wire must be E.164 and have no spaces when SMS consent is set;
 *   we normalize whitespace only; E.164 is a store/data contract.
 * - `klaviyo-api` expects JS `phoneNumber` on attributes (serializer maps to `phone_number`).
 */

type HandleCustomerConsentInput = {
  profileId: string;
  customer: CustomerDTO;
};

/** Attributes passed into klaviyo-api must use JS property names (e.g. phoneNumber), not JSON wire keys (phone_number), or ObjectSerializer drops them. */
type BulkSubscribeProfileAttributes = {
  email?: string;
  phoneNumber?: string;
  subscriptions: SubscriptionChannels;
};

const handleCustomerConsentStep = createStep(
  "handle-customer-consent",
  async ({ profileId, customer }: HandleCustomerConsentInput, context) => {
    const klaviyoService =
      context.container.resolve<IKlaviyoService>(KLAVIYO_MODULE);

    const traceEnabled = process.env.KLAVIYO_DEBUG === "true";
    const trace = (event: string, payload: Record<string, unknown>) => {
      if (!traceEnabled) {
        return;
      }
      const line = JSON.stringify({
        source: "klaviyo_plugin_handle_customer_consent",
        event,
        customer_id: customer?.id,
        ...payload,
      });
      try {
        const logger = context.container.resolve(ContainerRegistrationKeys.LOGGER);
        if (logger && typeof (logger as { info?: (m: string) => void }).info === "function") {
          (logger as { info: (m: string) => void }).info(line);
        } else {
          console.info(line);
        }
      } catch {
        console.info(line);
      }
    };

    // Default to no consent if metadata is missing
    if (!customer.metadata || !customer.metadata.klaviyo) {
      trace("early_exit", { reason: "no_metadata_klaviyo" });
      return new StepResponse(
        "No Klaviyo consent metadata found for customer",
        null
      );
    }

    // Try to parse the klaviyo consent object from metadata
    let consentData: KlaviyoConsent;
    try {
      consentData =
        typeof customer.metadata.klaviyo === "string"
          ? JSON.parse(customer.metadata.klaviyo)
          : customer.metadata.klaviyo;
    } catch (error) {
      trace("parse_error", {
        message: error instanceof Error ? error.message : String(error),
      });
      console.error(
        `Error parsing klaviyo consent data for customer ${customer.id}:`,
        error
      );
      return new StepResponse("Invalid Klaviyo consent data format", null);
    }

    // Check if there's any consent set
    const hasEmailConsent = Boolean(consentData.email);
    const hasSmsConsent = Boolean(consentData.sms);
    const hasTransactionalSmsConsent = Boolean(consentData.transactional_sms);
    const trimmedPhone =
      typeof customer.phone === "string" && customer.phone.trim()
        ? normalizeKlaviyoProfilePhoneNumber(customer.phone)
        : "";

    if (!hasEmailConsent && !hasSmsConsent && !hasTransactionalSmsConsent) {
      trace("early_exit", {
        reason: "no_channel_consent",
        hasEmailConsent,
        hasSmsConsent,
        hasTransactionalSmsConsent,
      });
      return new StepResponse(
        "Customer has not provided consent for any channel",
        null
      );
    }

    const attributes: BulkSubscribeProfileAttributes = {
      subscriptions: {} as SubscriptionChannels,
    };

    // Only add defined values
    if (customer.email && hasEmailConsent) {
      attributes.email = customer.email;
      attributes.subscriptions.email = {
        marketing: {
          consent: SubscriptionParameters.ConsentEnum.Subscribed,
        },
      };
    }

    if (trimmedPhone) {
      if (hasTransactionalSmsConsent) {
        attributes.subscriptions.sms = {
          ...attributes.subscriptions.sms,
          transactional: {
            consent: SubscriptionParameters.ConsentEnum.Subscribed,
          },
        };
      }
      if (hasSmsConsent) {
        attributes.subscriptions.sms = {
          ...attributes.subscriptions.sms,
          marketing: {
            consent: SubscriptionParameters.ConsentEnum.Subscribed,
          },
        };
      }
    }

    if (!attributes.subscriptions.email && !attributes.subscriptions.sms) {
      trace("early_exit", {
        reason: "no_subscription_payload_after_build",
        has_customer_email: Boolean(customer.email),
        has_customer_phone: Boolean(trimmedPhone),
        hasEmailConsent,
        hasSmsConsent,
        hasTransactionalSmsConsent,
      });
      return new StepResponse(
        "Customer has not provided consent for any channel",
        null
      );
    }

    /**
     * Klaviyo subscription bulk jobs can treat omitted profile fields as updates to the
     * same profile id; include phone whenever we have it so email-only jobs do not strip SMS.
     */
    if (trimmedPhone) {
      attributes.phoneNumber = trimmedPhone;
    }

    // Build the payload for bulk subscribe
    const payload = [
      {
        type: "profile" as const,
        id: profileId,
        attributes,
      },
    ];

    trace("bulk_subscribe_attempt", {
      profileId,
      channels: {
        email: Boolean(attributes.subscriptions.email),
        sms: Boolean(attributes.subscriptions.sms),
      },
    });

    try {
      const result = await klaviyoService.bulkSubscribeProfiles(payload);
      let normalized: unknown = result;
      if (typeof normalized === "string") {
        const trimmed = normalized.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            normalized = JSON.parse(trimmed) as unknown;
          } catch {
            /* keep string */
          }
        }
      }
      const data =
        normalized &&
        typeof normalized === "object" &&
        "data" in normalized &&
        (normalized as { data?: unknown }).data &&
        typeof (normalized as { data?: unknown }).data === "object"
          ? ((normalized as { data: Record<string, unknown> }).data as Record<
              string,
              unknown
            >)
          : null;
      trace("bulk_subscribe_ok", {
        profileId,
        result_type: result == null ? "null" : typeof result,
        normalized_type:
          normalized == null ? "null" : typeof normalized,
        result_keys:
          normalized && typeof normalized === "object"
            ? Object.keys(normalized as object)
            : [],
        bulk_job_id:
          data && typeof data.id === "string" ? data.id : undefined,
        http_note:
          "Subscriptions are applied asynchronously; confirm in Klaviyo (Profiles / bulk jobs) if UI lags.",
      });
      const parts: string[] = [];
      if (hasEmailConsent) {
        parts.push("email");
      }
      if (hasSmsConsent) {
        parts.push("sms_marketing");
      }
      if (hasTransactionalSmsConsent) {
        parts.push("sms_transactional");
      }
      return new StepResponse(
        `Customer ${customer.id} subscribed to Klaviyo channels: ${parts.join(", ") || "(none)"}`,
        result
      );
    } catch (error) {
      trace("bulk_subscribe_error", {
        profileId,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      console.error(
        `Error subscribing customer ${customer.id} to Klaviyo:`,
        error
      );
      return new StepResponse("Failed to subscribe customer to Klaviyo", null);
    }
  }
);

export default handleCustomerConsentStep;
