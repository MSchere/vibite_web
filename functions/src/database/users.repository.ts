import * as admin from "firebase-admin";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";
import { User } from "$types/user";

export class UsersRepository {
    static db = admin.firestore();

    static getUsersCollection(): CollectionReference<DocumentData> {
        return this.db.collection("users");
    }

    static async createUser(user: User): Promise<DocumentData> {
        const usersRef = this.getUsersCollection();
        return await usersRef.add(user);
    }

    static async getUserByEmail(email: string): Promise<DocumentData> {
        const usersRef = this.getUsersCollection();
        const query = await usersRef.where("email", "==", email).get();
        return query.docs[0]?.data() as User;
    }
}
