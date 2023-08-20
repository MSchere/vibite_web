import type { NutrientNames } from "$src/types/dish";
import { writable, type Writable } from "svelte/store";

export enum OrderingCriteria {
    SCORE = "score",
    PRICE = "price",
    UPDATED_AT = "updatedAt",
}

export interface Filter {
    search?: string;
    priceRange?: [number, number];
    nutrientRanges?: Record<NutrientNames, [number, number]>;
    onlyAvailable?: boolean;
    onlyVegan?: boolean;
    onlyGlutenFree?: boolean;
    onlyLactoseFree?: boolean;
    orderingCriteria: OrderingCriteria;
    orderingDirection: "asc" | "desc";
}

export const filter: Writable<Filter> = writable({
    orderingCriteria: OrderingCriteria.SCORE,
    orderingDirection: "desc",
});
