export type NutrientInfo = {
    unit: string;
    valueTotal: number;
    value100: number;
};

export enum NutrientName {
    ENERGY = "Energía",
    FAT = "Grasas",
    SATFAT = "Grasas saturadas",
    PROTEIN = "Proteínas",
    CARBS = "Carbohidratos",
    FIBER = "Fibra",
    SUGAR = "Azúcar",
    SALT = "Sal",
}

export type Nutrient = {
    energy: NutrientInfo;
    carbs: NutrientInfo;
    fiber: NutrientInfo;
    satFat: NutrientInfo;
    fat: NutrientInfo;
    sugar: NutrientInfo;
    salt: NutrientInfo;
    protein: NutrientInfo;
};

export type Rating = {
    average: number;
    count: number;
};

export type NutriScore = "A" | "B" | "C" | "D" | "E";

export enum Platform {
    WETACA = "Wetaca",
    TAPPERS = "Tappers",
    PROZIS = "Prozis",
    NOCOCINOMAS = "Nococinomas",
    MENUDIET = "Menudiet",
    GUISOS = "Guisos",
    KNOWEATS = "Knoweats",
    MIPLATO = "MiPlato",
}

export type Dish = {
    id: string;
    platform: Platform;
    name: string;
    description: string;
    ingredients: string;
    price: number;
    allergens: string;
    weight: number;
    nutrients: Nutrient;
    dishUrl: string;
    imageUrl: string;
    isGlutenFree: boolean;
    isVegan: boolean;
    isLactoseFree: boolean;
    nutriScore: NutriScore;
    score: number;
    isAvailable: boolean;
    updatedAt: number;
    rating: Rating;
};
