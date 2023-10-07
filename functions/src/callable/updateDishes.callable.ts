import { logger } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";
import { DishesRepository } from "src/database/dishes.repository";
import { WetacaDishProcessor } from "src/utils/wetacaDishProcessor";

export const updateDishesCallable = (exports.updateDishesCallable =
    onCall(
        { cors: true },
        async () => {
        const dishes = await WetacaDishProcessor.getAndProcessDishes();
        logger.log("Updated dishes:", dishes);
        DishesRepository.updateDishes(dishes);
        return dishes;
    }
));