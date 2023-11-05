import { Dish } from "$root/src/types/dish";
import { logger } from "firebase-functions/v2";
import { WetacaDishDto } from "src/dtos/wetacaDish.dto";
import { calculateNutriScore } from "./calculators";

export class WetacaDishProcessor {
    private static readonly WETACA_API_URL = "https://api.wetaca.com/graphql";
    private static readonly WETACA_DISHES_QUERY = `
    query menu($salesPlanId: ModelId, $salesPlanPackageOptionIndex: Int, $zipcode: Int, $includeDishes: [Int!]) {\n  menu(\n    salesPlanId: $salesPlanId\n    salesPlanPackageOptionIndex: $salesPlanPackageOptionIndex\n    zipcode: $zipcode\n    includeDishes: $includeDishes\n  ) {\n    id\n    dateFrom\n    dateTo\n    extended\n    dishes {\n      datePublished\n      id\n      name\n      slug\n      price\n      subscriptionPrice\n      category {\n        _id\n        id: slug\n        name\n        slug\n        description\n        order\n        subscriptionPrice\n        __typename\n      }\n      tags\n      ingredients\n      ingredientsBreakdown\n      allergens\n      isNew\n      features\n      specialTemplate\n      rating {\n        averageRating\n        reviewCount\n        __typename\n      }\n      isPromoted\n      frontPage\n      weight\n      nutritionFacts {\n        energy\n        totalFat\n        saturatedFat\n        proteins\n        hydrates\n        sugars\n        fiber\n        salt\n        __typename\n      }\n      __typename\n    }\n    otherDishes {\n      datePublished\n      id\n      name\n      slug\n      price\n      subscriptionPrice\n      category {\n        _id\n        id: slug\n        name\n        slug\n        description\n        order\n        subscriptionPrice\n        __typename\n      }\n      tags\n      ingredients\n      ingredientsBreakdown\n      allergens\n      isNew\n      features\n      specialTemplate\n      rating {\n        averageRating\n        reviewCount\n        __typename\n      }\n      isPromoted\n      frontPage\n      weight\n      nutritionFacts {\n        energy\n        totalFat\n        saturatedFat\n        proteins\n        hydrates\n        sugars\n        fiber\n        salt\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n`;

    static async getAndProcessDishes(): Promise<Dish[]> {
        const wetacaDishes = await this.getDishes();
        if (wetacaDishes.length === 0) throw new Error("Error getting Wetaca dishes");
        return wetacaDishes.map((wetacaDish) => this.processDish(wetacaDish));
    }

    static async getDishes(): Promise<WetacaDishDto[]> {
        try {
            const body = JSON.stringify({
                operationName: "menu",
                query: WetacaDishProcessor.WETACA_DISHES_QUERY,
                variables: {},
            });
            const response = await fetch(WetacaDishProcessor.WETACA_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": `${Buffer.byteLength(body)}`,
                    "User-Agent": "ViBite V1.0",
                    Host: "www.wetaca.com",
                },
                body,
            });
            const json = await response.json();
            logger.log("REPONSE FROM WETACA", response);
            logger.log("JSON RESPONSE FROM WETACA", json);
            return json.data.menu.dishes as WetacaDishDto[];
        } catch (error: any) {
            logger.error(error);
            return [];
        }
    }

    private static processDish(wetacaDish: WetacaDishDto): Dish {
        const { id, name, price, slug, ingredients, allergens, category, tags, rating } = wetacaDish;

        const isVegan = tags.includes("VEGAN");
        const isLactoseFree = tags.includes("milk");
        const hasGluten = allergens.includes("gluten");
        const dish: Dish = {
            id: `${id}`,
            name,
            description: category.description,
            ingredients: ingredients.join(", "),
            price: price / 100,
            allergens: allergens.join(", "),
            dishUrl: `https://wetaca.com/carta/comidas/${slug}-${id}`,
            imageUrl: `https://static.wetaca.com/products/${id}/detail/${slug}_B.jpg`,
            isGlutenFree: !hasGluten,
            isVegan,
            isLactoseFree,
            nutriScore: "A",
            score: 4,
            isAvailable: true,
            updatedAt: Date.now(),
            rating: {
                average: rating.averageRating,
                count: rating.reviewCount,
            },
            nutrients: {
                energy: {
                    unit: "kcal",
                    valueTotal: wetacaDish.nutritionFacts.energy,
                    value100: (wetacaDish.nutritionFacts.energy / wetacaDish.weight) * 100,
                },
                carbs: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.hydrates,
                    value100: (wetacaDish.nutritionFacts.hydrates / wetacaDish.weight) * 100,
                },
                fiber: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.fiber,
                    value100: (wetacaDish.nutritionFacts.fiber / wetacaDish.weight) * 100,
                },
                satFat: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.saturatedFat,
                    value100: (wetacaDish.nutritionFacts.saturatedFat / wetacaDish.weight) * 100,
                },
                fat: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.totalFat,
                    value100: (wetacaDish.nutritionFacts.totalFat / wetacaDish.weight) * 100,
                },
                sugar: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.sugars,
                    value100: (wetacaDish.nutritionFacts.sugars / wetacaDish.weight) * 100,
                },
                salt: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.salt,
                    value100: (wetacaDish.nutritionFacts.salt / wetacaDish.weight) * 100,
                },
                protein: {
                    unit: "g",
                    valueTotal: wetacaDish.nutritionFacts.proteins,
                    value100: (wetacaDish.nutritionFacts.proteins / wetacaDish.weight) * 100,
                },
            },
        };
        const { nutriScore, score } = calculateNutriScore(dish);
        dish.nutriScore = nutriScore;
        dish.score = score;
        return dish;
    }
}
