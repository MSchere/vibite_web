import { Platform } from "$root/src/types/dish";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { DishesRepository } from "src/database/dishes.repository";

export const disableDishesScheduled = (exports.disableDishesScheduled = onSchedule("0 0 * * 4", async () => {
    const dishesDisabled = await DishesRepository.disbleDishes([Platform.WETACA, Platform.TAPPERS]);
    console.log(`Disabled ${dishesDisabled} dishes`);
}));
