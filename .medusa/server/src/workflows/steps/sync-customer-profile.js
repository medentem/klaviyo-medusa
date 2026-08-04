"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const klaviyo_1 = require("../../types/klaviyo");
const syncCustomerProfileStep = (0, workflows_sdk_1.createStep)("sync-customer-profile", async (attributes, context) => {
    const klaviyoService = context.container.resolve(klaviyo_1.KLAVIYO_MODULE);
    const profile = await klaviyoService.upsertProfile(attributes);
    return new workflows_sdk_1.StepResponse(profile, profile.data.id);
});
exports.default = syncCustomerProfileStep;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1jdXN0b21lci1wcm9maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9zdGVwcy9zeW5jLWN1c3RvbWVyLXByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFBNkU7QUFFN0UsaURBQXNFO0FBRXRFLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSwwQkFBVSxFQUN4Qyx1QkFBdUIsRUFDdkIsS0FBSyxFQUFFLFVBQXNELEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDeEUsTUFBTSxjQUFjLEdBQ2xCLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFrQix3QkFBYyxDQUFDLENBQUM7SUFFN0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxjQUFjLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRS9ELE9BQU8sSUFBSSw0QkFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BELENBQUMsQ0FDRixDQUFDO0FBRUYsa0JBQWUsdUJBQXVCLENBQUMifQ==