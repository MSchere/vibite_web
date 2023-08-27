import type { NutrientNames } from "$src/types/dish";
import { writable, type Writable } from "svelte/store";

export enum Order {
    SCORE = "score",
    PRICE = "price",
    UPDATED_AT = "updatedAt",
    NAME = "name",
    ENERGY = "nutrients.energy.value100",
}

export const OrderTranslation = {
    [Order.SCORE]: "Nutriscore",
    [Order.PRICE]: "Precio",
    [Order.UPDATED_AT]: "Actualizado",
    [Order.NAME]: "Nombre",
}

export interface Filter {
    isOpen: boolean;
    priceRange?: [number, number];
    nutrientRanges?: Record<NutrientNames, [number, number]>;
    onlyAvailable?: boolean;
    onlyVegan?: boolean;
    onlyGlutenFree?: boolean;
    onlyLactoseFree?: boolean;
}

export interface OrderingCriteria {
    field: Order;
    direction: "asc" | "desc";
}

export const filter: Writable<Filter> = writable({
    isOpen: false,
    onlyAvailable: true
});

export const search: Writable<string> = writable("");

export const orderingCriteria: Writable<OrderingCriteria> = writable({
    field: Order.SCORE,
    direction: "desc",
});

export function resetOrderingCriteria() {
    orderingCriteria.set({
        field: Order.SCORE,
        direction: "desc",
    });
}

export function clearSearch() {
    search.set("");
}