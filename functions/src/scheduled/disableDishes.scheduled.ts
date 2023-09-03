import { onSchedule } from "firebase-functions/v2/scheduler";
import { DishesRepository } from "src/database/dishes.repository";

export const disableDishesScheduled = (exports.disableDishesScheduled =
    onSchedule("0 0 * * 4", async () => {
        await DishesRepository.disbleDishes();
        console.log("Disabled all dishes");
    }));
