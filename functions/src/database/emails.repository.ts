import { Email } from "$types/email";
import * as admin from "firebase-admin";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";

export class EmailsRepository {
    static db = admin.firestore();

    static getEmailsCollection(): CollectionReference<DocumentData> {
        return this.db.collection("emails");
    }

    static async createEmail(email: Email): Promise<DocumentData> {
        const emailsRef = this.getEmailsCollection();
        return await emailsRef.add(email);
    }
}
