<script script lang="ts">
    import { httpsCallable } from "firebase/functions";
    import { functions } from "$lib/firebase";
    import { ErrorType } from "$types/error";

    let email = "";
    let emailError = "";
    let subscribed = false;

    async function subscribe() {
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            emailError = "Por favor, introduce un correo electrónico válido.";
        } else {
            try {
                const subscribeCallable = httpsCallable(
                    functions,
                    "subscribeToNewsletterCallable",
                );
                await subscribeCallable({ emailAddress: email });
                emailError = "";
                email = "";
                subscribed = true;
            } catch (error: any) {
                if (error.message?.includes(ErrorType.UserAlreadyExists)) {
                    emailError = "Ya estás suscrito a nuestra newsletter.";
                } else {
                    emailError =
                        "Ha ocurrido un error al suscribirte a nuestra newsletter.";
                }
            }
        }
    }
</script>

<div id="frame">
    <main>
        <section class="container">
            <div class="section">
                <h1 class="title primary">
                    <a href="/"> ViBite </a>
                </h1>
                <p class="text">
                    ViBite te permite encontrar y comparar tus tuppers de comida
                    saludable favoritos de diferentes proveedores en un solo
                    lugar. Basándote en tus objetivos nutricionales, te
                    proporcionamos un sistema de puntuación para ayudarte a
                    tomar la mejor decisión.
                </p>
            </div>

            <div class="section">
                <p class="text">
                    Comparamos platos de las siguientes webs para ofrecerte la
                    mejor opción:
                </p>
                <ul class="text">
                    <div class="d-flex align-center gap-0-5">
                        <input type="checkbox" checked={true} disabled={true} />
                        <li>Wetaca</li>
                    </div>
                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Guisos.com</li>
                    </div>
                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Knoweats</li>
                    </div>
                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Menudiet</li>
                    </div>

                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Mi Plato</li>
                    </div>
                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Nococinomas</li>
                    </div>
                    <div class="d-flex align-center gap-0-5">
                        <input
                            type="checkbox"
                            class="unchecked"
                            disabled={true}
                        />
                        <li>Tappers.es</li>
                    </div>
                </ul>
                <a href="/dishes">
                    <button class="button"> Ver platos </button>
                </a>
            </div>

            <div class="section subscribe">
                <p class="text">
                    Aprovecha las herramientas de ViBite para calcular tu BMI,
                    BMR y Metabolismo Basal y elegir los platos que mejor se
                    adaptan a tus necesidades. ¡Únete a nuestra newsletter para
                    mantenerte al día con los avances del proyecto!
                </p>

                <div class="section">
                    <input
                        class="input"
                        bind:value={email}
                        placeholder="Introduce tu correo electrónico..."
                        disabled={subscribed}
                    />
                    <button
                        class="button"
                        on:click={subscribe}
                        disabled={subscribed}
                    >
                        Suscribirse
                    </button>
                    {#if emailError}<p class="error">{emailError}</p>{/if}
                    {#if subscribed}<p class="success">
                            ¡Gracias por suscribirte!
                        </p>{/if}
                </div>
            </div>
        </section>
    </main>
</div>

<style lang="scss">
    li {
        list-style: none;
    }
    input:disabled:checked {
        background-color: var(--primary);
        border-color: var(--primary);
    }
    .unchecked {
        background-image: unset;
        background-color: unset;
    }
    .subscribe {
        margin-top: 100px;
    }
    section {
        padding: 2em;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 1em;
        margin: 2em;
    }
</style>
