export type NutrientInfo = {
    unit: string;
    valueTotal: number;
    value100: number;
};

export enum NutrientNames {
    ENERGY = "Energía",
    FAT = "Grasas",
    SATFAT = "Grasas saturadas",
    PROTEIN = "Proteínas",
    CARBS = "Carbohidratos",
    FIBER = "Fibra",
    SUGAR = "Azúcar",
    SALT = "Sal",
}

export type Nutrients = {
    ENERGY: NutrientInfo;
    carbs: NutrientInfo;
    fiber: NutrientInfo;
    satFat: NutrientInfo;
    fat: NutrientInfo;
    sugar: NutrientInfo;
    salt: NutrientInfo;
    protein: NutrientInfo;
};


export type Dish = {
    name: string;
    description: string;
    ingredients: string;
    price: number;
    allergens: string;
    nutrients: Nutrients;
    dishUrl: string;
    imageUrl: string;
    isGlutenFree: boolean;
    isVegan: boolean;
    isLactoseFree: boolean;
    nutriScore: string;
    score: number;
    isAvailable: boolean;
    updatedAt: number;
};
