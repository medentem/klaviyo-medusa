"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const currencyCode = req.params.currencyCode.toLowerCase();
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "*",
            "variants.*",
            "variants.product.*",
            "variants.prices.*",
            "variants.calculated_price.*",
            "images.*",
            "categories.*",
        ],
        context: {
            variants: {
                calculated_price: (0, utils_1.QueryContext)({
                    currency_code: currencyCode,
                }),
            },
        },
    });
    const productsWithCalculatedPrice = products.map((product) => {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            handle: product.handle,
            thumbnail: product.thumbnail,
            image_link: product.images?.[0]?.url,
            from_price: product.variants.reduce((acc, variant) => {
                return Math.min(acc, variant.calculated_price.calculated_amount);
            }, Infinity),
            currency_code: currencyCode,
            url: `https://www.medusajs.com/products/${product.handle}`,
            categories: product.categories.map((category) => category.name),
        };
    });
    res.json(productsWithCalculatedPrice);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2ZlZWRzL3Byb2R1Y3RzL1tjdXJyZW5jeUNvZGVdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsa0JBMENDO0FBL0NELHFEQUdtQztBQUU1QixLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFM0QsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFO1lBQ04sR0FBRztZQUNILFlBQVk7WUFDWixvQkFBb0I7WUFDcEIsbUJBQW1CO1lBQ25CLDZCQUE2QjtZQUM3QixVQUFVO1lBQ1YsY0FBYztTQUNmO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLGdCQUFnQixFQUFFLElBQUEsb0JBQVksRUFBQztvQkFDN0IsYUFBYSxFQUFFLFlBQVk7aUJBQzVCLENBQUM7YUFDSDtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSwyQkFBMkIsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDM0QsT0FBTztZQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNkLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDaEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3RCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7WUFDcEMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ25FLENBQUMsRUFBRSxRQUFRLENBQUM7WUFDWixhQUFhLEVBQUUsWUFBWTtZQUMzQixHQUFHLEVBQUUscUNBQXFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDMUQsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQ2hFLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN4QyxDQUFDIn0=