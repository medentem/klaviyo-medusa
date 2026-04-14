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

    if (!hasEmailConsent && !hasSmsConsent) {
      trace("early_exit", {
        reason: "no_channel_consent",
        hasEmailConsent,
        hasSmsConsent,
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

    if (customer.phone) {
      attributes.phoneNumber = customer.phone;
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
        has_customer_phone: Boolean(customer.phone),
        hasEmailConsent,
        hasSmsConsent,
      });
      return new StepResponse(
        "Customer has not provided consent for any channel",
        null
      );
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
      trace("bulk_subscribe_ok", {
        profileId,
        result_type: result ? typeof result : "null",
        result_keys:
          result && typeof result === "object"
            ? Object.keys(result as object)
            : [],
      });
      return new StepResponse(
        `Customer ${customer.id} subscribed to Klaviyo channels: ${
          hasEmailConsent ? "email " : ""
        }${hasSmsConsent ? "sms" : ""}`,
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
