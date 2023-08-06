import { Dish } from "$types/dish";
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

    static async disbleDishes(): Promise<void> {
        const dishesRef = this.getDishesCollection();
        const dishesSnapshot = await dishesRef.get();
        dishesSnapshot.docs.forEach((doc) => {
            doc.ref.update({ isAvailable: false });
        });
    }
}
