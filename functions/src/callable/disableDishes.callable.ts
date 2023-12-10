import { Platform } from "$root/src/types/dish";
import { onCall } from "firebase-functions/v2/https";
import { DishesRepository } from "src/database/dishes.repository";

export const disableDishesCallable = (exports.subscribeToNewsletterCallable = onCall({ cors: true }, async () => {
    const dishesDisabled = await DishesRepository.disbleDishes([Platform.WETACA, Platform.TAPPERS]);
    console.log(`Disabled ${dishesDisabled} dishes`);
    return `Disabled ${dishesDisabled} dishes`;
}));
