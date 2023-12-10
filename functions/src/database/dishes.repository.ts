import { Dish, Platform } from "$types/dish";
import * as admin from "firebase-admin";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";

export class DishesRepository {
    static db = admin.firestore();

    static getDishesCollection(): CollectionReference<DocumentData> {
        return this.db.collection("dishes");
    }

    static async getDishes(): Promise<DocumentData[]> {
        const dishesRef = this.getDishesCollection();
        const dishesSnapshot = await dishesRef.get();
        return dishesSnapshot.docs.map((doc) => doc.data());
    }

    static async createDish(dish: Dish): Promise<DocumentData> {
        const dishesRef = this.getDishesCollection();
        return await dishesRef.add(dish);
    }

    static async updateDish(dish: Dish): Promise<void> {
        const dishesRef = this.getDishesCollection();
        const dishRef = dishesRef.doc(dish.id);
        await dishRef.update(dish);
    }

    static async updateDishes(dishes: Dish[]): Promise<void> {
        const dishesRef = this.getDishesCollection();
        dishes.forEach(async (dish) => {
            const dishRef = dishesRef.doc(dish.id);
            await dishRef.update(dish);
        });
    }

    static async disbleDishes(platforms: Platform[]): Promise<number> {
        const dishesRef = this.getDishesCollection();
        // disable only wetaca and tappers dishes
        const dishesSnapshot = await dishesRef
            .where("platform", "in", platforms)
            .where("isAvailable", "==", true)
            .get();
        const dishIds = dishesSnapshot.docs.map((doc) => doc.id);
        for (const id of dishIds) {
            const dishRef = dishesRef.doc(id);
            await dishRef.update({ isAvailable: false });
        }
        return dishIds.length;
    }
}
