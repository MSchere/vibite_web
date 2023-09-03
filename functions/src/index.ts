import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

admin.initializeApp();

setGlobalOptions({
    maxInstances: 1,
    region: "europe-west1",
});

export { updateDishesCallable } from "./callable/updateDishes.callable";
export { subscribeToNewsletterCallable } from "./email/sendNewsletterEmail.callable";
export { disableDishesScheduled } from "./scheduled/disableDishes.scheduled";
export { updateDishesScheduled } from "./scheduled/updateDishes.scheduled";

