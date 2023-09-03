import { Dish, NutriScore, NutrientNames } from "$root/src/types/dish";

export function calculateNutriScore(dish: Dish): {
    nutriScore: NutriScore;
    score: number;
} {

    const badNutrientsTable: Record<string, number[]> = {
        points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        energy: [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350],
        sugar: [4.5, 9, 13.5, 18, 22.5, 27, 31.5, 36, 40.5, 45],
        satFat: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        salt: [0.09, 0.18, 0.27, 0.36, 0.45, 0.54, 0.63, 0.72, 0.81, 0.90],
    };

    const goodNutrientsTable: Record<string, number[]> = {
        points: [1, 2, 3, 4, 5],
        fiber: [0.7, 1.4, 2.1, 2.8, 3.5],
        protein: [1.6, 3.2, 4.8, 6.4, 8],
    };

    let points = 0;

    for (const nutrientName of Object.keys(dish.nutrients)) {
        const nutrients = dish.nutrients as Record<string, { value100: number }>;

        if (nutrientName === "energy") {
            const energy = dish.nutrients[nutrientName].value100;
            const interval = badNutrientsTable[NutrientNames.ENERGY];

            for (let i = 0; i < interval.length; i++) {
                if (energy < interval[i]) {
                    points += badNutrientsTable.points[i];
                    break;
                }
            }
        }

        else if (["sugar", "satFat", "salt"].includes(nutrientName)) {
            const value = nutrients[nutrientName].value100;
            const interval = badNutrientsTable[nutrientName];

            for (let i = 0; i < interval.length; i++) {
                if (value >= interval[i]) {
                    points += badNutrientsTable.points[i];
                    break;
                }
            }
        }

        else if (["fiber", "protein"].includes(nutrientName)) {
            const value = nutrients[nutrientName].value100;
            const interval = goodNutrientsTable[nutrientName];

            for (let i = 0; i < interval.length; i++) {
                if (value >= interval[i]) {
                    points -= goodNutrientsTable.points[i];
                    break;
                }
            }
        }
    }

    let nutriScore: NutriScore;
    if (points <= -1) nutriScore = "A";
    else if (points <= 2) nutriScore = "B";
    else if (points <= 10) nutriScore = "C";
    else if (points <= 18) nutriScore = "D";
    else nutriScore = "E";

    const score = (points - 40) / -55 * 10;

    return { nutriScore, score };
}