import { onCall } from "firebase-functions/v2/https";
import { DishesRepository } from "src/database/dishes.repository";
import { WetacaDishProcessor } from "src/utils/wetacaDishProcessor";

export const updateDishesCallable = (exports.updateDishesCallable =
    onCall(async () => {
        const dishes = await WetacaDishProcessor.getAndProcessDishes();
        DishesRepository.updateDishes(dishes);
        return dishes;
    }
));