"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const klaviyo_1 = require("../../types/klaviyo");
const klaviyo_api_1 = require("klaviyo-api");
const klaviyo_sms_env_1 = require("../../lib/klaviyo-sms-env");
const normalize_klaviyo_phone_1 = require("../../lib/normalize-klaviyo-phone");
const handleCustomerConsentStep = (0, workflows_sdk_1.createStep)("handle-customer-consent", async ({ profileId, customer }, context) => {
    const klaviyoService = context.container.resolve(klaviyo_1.KLAVIYO_MODULE);
    const traceEnabled = process.env.KLAVIYO_DEBUG === "true";
    const trace = (event, payload) => {
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
            const logger = context.container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
            if (logger && typeof logger.info === "function") {
                logger.info(line);
            }
            else {
                console.info(line);
            }
        }
        catch {
            console.info(line);
        }
    };
    // Default to no consent if metadata is missing
    if (!customer.metadata || !customer.metadata.klaviyo) {
        trace("early_exit", { reason: "no_metadata_klaviyo" });
        return new workflows_sdk_1.StepResponse("No Klaviyo consent metadata found for customer", null);
    }
    // Try to parse the klaviyo consent object from metadata
    let consentData;
    try {
        consentData =
            typeof customer.metadata.klaviyo === "string"
                ? JSON.parse(customer.metadata.klaviyo)
                : customer.metadata.klaviyo;
    }
    catch (error) {
        trace("parse_error", {
            message: error instanceof Error ? error.message : String(error),
        });
        console.error(`Error parsing klaviyo consent data for customer ${customer.id}:`, error);
        return new workflows_sdk_1.StepResponse("Invalid Klaviyo consent data format", null);
    }
    const smsCapable = (0, klaviyo_sms_env_1.klaviyoSmsEnabledFromEnv)();
    const hasEmailConsent = Boolean(consentData.email);
    const hasSmsConsentMeta = Boolean(consentData.sms);
    const hasTransactionalSmsMeta = Boolean(consentData.transactional_sms);
    const wantSmsMarketing = smsCapable && hasSmsConsentMeta;
    const wantTransactionalSms = smsCapable && hasTransactionalSmsMeta;
    const trimmedPhone = typeof customer.phone === "string" && customer.phone.trim()
        ? (0, normalize_klaviyo_phone_1.normalizeKlaviyoProfilePhoneNumber)(customer.phone)
        : "";
    if (!hasEmailConsent && !wantSmsMarketing && !wantTransactionalSms) {
        trace("early_exit", {
            reason: "no_channel_consent",
            hasEmailConsent,
            wantSmsMarketing,
            wantTransactionalSms,
            sms_capable: smsCapable,
        });
        return new workflows_sdk_1.StepResponse("Customer has not provided consent for any channel", null);
    }
    const attributes = {
        subscriptions: {},
    };
    // Only add defined values
    if (customer.email && hasEmailConsent) {
        attributes.email = customer.email;
        attributes.subscriptions.email = {
            marketing: {
                consent: klaviyo_api_1.SubscriptionParameters.ConsentEnum.Subscribed,
            },
        };
    }
    if (trimmedPhone) {
        if (wantTransactionalSms) {
            attributes.subscriptions.sms = {
                ...attributes.subscriptions.sms,
                transactional: {
                    consent: klaviyo_api_1.SubscriptionParameters.ConsentEnum.Subscribed,
                },
            };
        }
        if (wantSmsMarketing) {
            attributes.subscriptions.sms = {
                ...attributes.subscriptions.sms,
                marketing: {
                    consent: klaviyo_api_1.SubscriptionParameters.ConsentEnum.Subscribed,
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
            wantSmsMarketing,
            wantTransactionalSms,
        });
        return new workflows_sdk_1.StepResponse("Customer has not provided consent for any channel", null);
    }
    /**
     * Include `phoneNumber` only when this job sets SMS subscriptions (Klaviyo consent API).
     */
    if (trimmedPhone && attributes.subscriptions.sms) {
        attributes.phoneNumber = trimmedPhone;
    }
    // Build the payload for bulk subscribe
    const payload = [
        {
            type: "profile",
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
        let normalized = result;
        if (typeof normalized === "string") {
            const trimmed = normalized.trim();
            if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                try {
                    normalized = JSON.parse(trimmed);
                }
                catch {
                    /* keep string */
                }
            }
        }
        const data = normalized &&
            typeof normalized === "object" &&
            "data" in normalized &&
            normalized.data &&
            typeof normalized.data === "object"
            ? normalized.data
            : null;
        trace("bulk_subscribe_ok", {
            profileId,
            result_type: result == null ? "null" : typeof result,
            normalized_type: normalized == null ? "null" : typeof normalized,
            result_keys: normalized && typeof normalized === "object"
                ? Object.keys(normalized)
                : [],
            bulk_job_id: data && typeof data.id === "string" ? data.id : undefined,
            http_note: "Subscriptions are applied asynchronously; confirm in Klaviyo (Profiles / bulk jobs) if UI lags.",
        });
        const parts = [];
        if (hasEmailConsent) {
            parts.push("email");
        }
        if (wantSmsMarketing) {
            parts.push("sms_marketing");
        }
        if (wantTransactionalSms) {
            parts.push("sms_transactional");
        }
        return new workflows_sdk_1.StepResponse(`Customer ${customer.id} subscribed to Klaviyo channels: ${parts.join(", ") || "(none)"}`, result);
    }
    catch (error) {
        trace("bulk_subscribe_error", {
            profileId,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        console.error(`Error subscribing customer ${customer.id} to Klaviyo:`, error);
        return new workflows_sdk_1.StepResponse("Failed to subscribe customer to Klaviyo", null);
    }
});
exports.default = handleCustomerConsentStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWN1c3RvbWVyLWNvbnNlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL3N0ZXBzL2hhbmRsZS1jdXN0b21lci1jb25zZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUVBQTZFO0FBRTdFLHFEQUFzRTtBQUN0RSxpREFJNkI7QUFDN0IsNkNBR3FCO0FBQ3JCLCtEQUFxRTtBQUNyRSwrRUFBdUY7QUE4QnZGLE1BQU0seUJBQXlCLEdBQUcsSUFBQSwwQkFBVSxFQUMxQyx5QkFBeUIsRUFDekIsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBOEIsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNyRSxNQUFNLGNBQWMsR0FDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQWtCLHdCQUFjLENBQUMsQ0FBQztJQUU3RCxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUM7SUFDMUQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFhLEVBQUUsT0FBZ0MsRUFBRSxFQUFFO1FBQ2hFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQixPQUFPO1FBQ1QsQ0FBQztRQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDMUIsTUFBTSxFQUFFLHdDQUF3QztZQUNoRCxLQUFLO1lBQ0wsV0FBVyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ3pCLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQztZQUNILE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLElBQUksTUFBTSxJQUFJLE9BQVEsTUFBeUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQ25GLE1BQXdDLENBQUMsSUFBSSxD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