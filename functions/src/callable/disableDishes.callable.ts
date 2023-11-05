import { onCall } from "firebase-functions/v2/https";
import { DishesRepository } from "src/database/dishes.repository";

export const disableDishesCallable = (exports.subscribeToNewsletterCallable = onCall({ cors: true }, async () => {
    await DishesRepository.disbleDishes();
    console.log("Disabled all dishes");
}));
