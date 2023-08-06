export type NutrientInfo = {
    unit: string;
    valueTotal: number;
    value100: number;
};

export enum Nutrients {
    ENERGY = "Energía",
    CARBS = "Carbohidratos",
    FIBER = "Fibra",
    SATFAT = "Grasas saturadas",
    FAT = "Grasas",
    SUGAR = "Azúcar",
    SALT = "Sal",
    PROTEIN = "Proteínas",
}

export type Dish = {
    name: string;
    description: string;
    ingredients: string;
    price: number;
    allergens: string;
    nutrients: {
        energy: NutrientInfo;
        carbs: NutrientInfo;
        fiber: NutrientInfo;
        satFat: NutrientInfo;
        fat: NutrientInfo;
        sugar: NutrientInfo;
        salt: NutrientInfo;
        protein: NutrientInfo;
    };
    imageUrl: string;
    isGlutenFree: boolean;
    isVegan: boolean;
    isLactoseFree: boolean;
    nutriScore: string;
    score: number;
    isAvailable: boolean;
    updatedAt: number;
};
