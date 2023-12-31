import { Platform } from "$src/types/dish";
import { writable, type Writable } from "svelte/store";

export enum NutrientValues100 {
    ENERGY = "nutrients.energy.value100",
    FAT = "nutrients.fat.value100",
    SATFAT = "nutrients.satFat.value100",
    PROTEIN = "nutrients.protein.value100",
    CARBS = "nutrients.carbs.value100",
    FIBER = "nutrients.fiber.value100",
    SUGAR = "nutrients.sugar.value100",
    SALT = "nutrients.salt.value100",
}
export enum Order {
    SCORE = "score",
    PRICE = "price",
    UPDATED_AT = "updatedAt",
    NAME = "name",
    ENERGY = "nutrients.energy.value100",
    FAT = "nutrients.fat.value100",
    SATFAT = "nutrients.satFat.value100",
    PROTEIN = "nutrients.protein.value100",
    CARBS = "nutrients.carbs.value100",
    FIBER = "nutrients.fiber.value100",
    SUGAR = "nutrients.sugar.value100",
    SALT = "nutrients.salt.value100",
}

export const OrderTranslation = {
    [Order.SCORE]: "Nutriscore",
    [Order.PRICE]: "Precio",
    [Order.UPDATED_AT]: "Actualizado",
    [Order.NAME]: "Nombre",
    [Order.ENERGY]: "Energía",
    [Order.FAT]: "Grasas",
    [Order.SATFAT]: "Grasas sat",
    [Order.PROTEIN]: "Proteínas",
    [Order.CARBS]: "Carbos",
    [Order.FIBER]: "Fibra",
    [Order.SUGAR]: "Azúcar",
    [Order.SALT]: "Sal",
};

export interface Filter {
    isOpen: boolean;
    priceRange?: [number, number];
    nutrientRanges: Record<NutrientValues100, [number, number]>;
    platforms: Platform[];
    onlyAvailable?: boolean;
    onlyVegan?: boolean;
    onlyGlutenFree?: boolean;
    onlyLactoseFree?: boolean;
}

export interface OrderingCriteria {
    field: Order;
    direction: "asc" | "desc";
}

const defaultNutrientRanges: Record<NutrientValues100, [number, number]> = {
    [NutrientValues100.ENERGY]: [0, 0],
    [NutrientValues100.FAT]: [0, 0],
    [NutrientValues100.SATFAT]: [0, 0],
    [NutrientValues100.PROTEIN]: [0, 0],
    [NutrientValues100.CARBS]: [0, 0],
    [NutrientValues100.FIBER]: [0, 0],
    [NutrientValues100.SUGAR]: [0, 0],
    [NutrientValues100.SALT]: [0, 0],
};

const defaultPlatforms: Platform[] = [
    Platform.WETACA,
    Platform.TAPPERS,
    Platform.PROZIS,
    // add more here
];
export const filter: Writable<Filter> = writable({
    isOpen: false,
    onlyAvailable: true,
    nutrientRanges: defaultNutrientRanges,
    platforms: defaultPlatforms,
});

export const search: Writable<string> = writable("");

export const orderingCriteria: Writable<OrderingCriteria[]> = writable([
    {
        field: Order.SCORE,
        direction: "desc",
    },
]);

export function resetAll() {
    resetFilter();
    resetOrderingCriteria();
    clearSearch();
}

export function resetFilter() {
    filter.set({
        isOpen: false,
        onlyAvailable: true,
        nutrientRanges: defaultNutrientRanges,
        platforms: defaultPlatforms,
    });
}

export function resetOrderingCriteria() {
    orderingCriteria.set([
        {
            field: Order.SCORE,
            direction: "desc",
        },
    ]);
}

export function clearSearch() {
    search.set("");
}
