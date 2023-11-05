import { Email } from "$types/email";
import { ErrorType } from "$types/error";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { EmailsRepository } from "src/database/emails.repository";
import { UsersRepository } from "src/database/users.repository";

export const subscribeToNewsletterCallable = (exports.subscribeToNewsletterCallable = onCall(
    { cors: true },
    async (request) => {
        const { emailAddress } = request.data;

        const userExists = await UsersRepository.getUserByEmail(emailAddress);

        if (userExists) {
            throw new HttpsError("already-exists", ErrorType.UserAlreadyExists);
        }
        await UsersRepository.createUser({ email: emailAddress });
        const email: Email = {
            to: emailAddress,
            message: {
                subject: "Bienvenido a ViBite",
                text: "",
                html: `<h1>Bienvenido a la newsletter the ViBite!</h1>
                    <p>Gracias por suscribirte a nuestra newsletter</p>
                    <p>Pronto recibirás actualizaciones de nuestro excitante proyecto :)</p>
                    <p>Un saludo,</p>
                    <p>El equipo de ViBite</p>`,
            },
        };
        await EmailsRepository.createEmail(email);

        console.log(`Sent newsletter welcome email to ${emailAddress}`);
        return { success: true };
    },
));
