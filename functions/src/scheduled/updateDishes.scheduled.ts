import { onSchedule } from "firebase-functions/v2/scheduler";
import { DishesRepository } from "src/database/dishes.repository";
import { WetacaDishProcessor } from "src/utils/wetacaDishProcessor";
export const updateDishesScheduled = (exports.updateDishesScheduled =
    onSchedule("1 0 * * 4", async () => {
        const dishes = await WetacaDishProcessor.getAndProcessDishes();
        DishesRepository.updateDishes(dishes);
    }));
