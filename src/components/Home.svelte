<script script lang="ts">
    import { firestore, functions } from "$lib/firebase";
    import { Order, orderingCriteria, search } from "$src/lib/filters";
    import { ErrorType } from "$types/error";
    import Icon from "@iconify/svelte";
    import { collection, onSnapshot } from "firebase/firestore";
    import { httpsCallable } from "firebase/functions";

    let email = "";
    let emailError = "";
    let subscribed = false;
    let dishesCount =  0;

    async function subscribe() {
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            emailError = "Por favor, introduce un correo electrónico válido.";
        } else {
            try {
                const subscribeCallable = httpsCallable(functions, "subscribeToNewsletterCallable");
                await subscribeCallable({ emailAddress: email });
                emailError = "";
                email = "";
                subscribed = true;
            } catch (error: any) {
                if (error.message?.includes(ErrorType.UserAlreadyExists)) {
                    emailError = "Ya estás suscrito a nuestra newsletter.";
                } else {
                    emailError = "Ha ocurrido un error al suscribirte a nuestra newsletter.";
                }
            }
        }
    }

    function updateSearch(e: Event) {
        const srchValue = (e.target as HTMLInputElement).value.toLowerCase();
        if ($orderingCriteria[0].field !== Order.NAME) orderingCriteria.update((o) => ({ ...o, field: Order.NAME }));
        search.update((s) => srchValue);
    }

    function getNumberOfDishes() {
        const dishesRef = collection(firestore, "dishes");
        onSnapshot(dishesRef, (snapshot) => {
            dishesCount = snapshot.docs.length;
        });
    }

    getNumberOfDishes();
</script>

<main id="frame">
    <div class="container">
        <div class="flex flex-column items-center">
            <h1 class="title">
                <a href="/dishes"> ViBite </a>
            </h1>
            <form class="srch">
                <Icon icon="carbon:search" class="absolute" height="24" style="left: 1rem;"></Icon>
                <input type="text" class="srch-box" placeholder={`Buscar entre ${dishesCount} platos...`} on:keyup={updateSearch} />
                <div class="srch-btn">
                    <a href="/dishes">
                        <button type="submit">Buscar</button>
                    </a>
                </div>
            </form>
        </div>
        <div class="info container">
            <div class="section">
                <p class="text">
                    Encuentra y compara tus tuppers de comida favoritos de varios proveedores en un solo lugar:
                </p>
            </div>

            <div class="section">
                <ul class="text">
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" checked={true} disabled={true} />
                        <li>Wetaca</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" checked={true} disabled={true} />
                        <li>Tappers.es</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" checked={true} disabled={true} />
                        <li>Prozis</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" class="unchecked" disabled={true} />
                        <li>Nococinomas</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" class="unchecked" disabled={true} />
                        <li>Menudiet</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" class="unchecked" disabled={true} />
                        <li>Guisos.com</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" class="unchecked" disabled={true} />
                        <li>Knoweats</li>
                    </div>
                    <div class="flex items-center gap-0-5">
                        <input type="checkbox" class="unchecked" disabled={true} />
                        <li>Mi Plato</li>
                    </div>
                </ul>
            </div>

            <div class="section">
                <p class="text">
                    Aprovecha las herramientas de ViBite para calcular tu BMI, BMR y Metabolismo Basal y elegir los
                    platos que mejor se adapten a tus necesidades.
                </p>
                <p>
                    ¡Únete a nuestra newsletter para <strong>mantenerte al día</strong> en los avances del proyecto!
                </p>
                <div class="flex flex-column">
                    <form class="email">
                        <Icon icon="carbon:email" class="absolute" height="24" style="left: 1rem;"></Icon>
                        <input
                            class="input email-input"
                            bind:value={email}
                            placeholder="Introduce tu email.."
                            disabled={subscribed}
                        />
                        <button
                            class="outline absolute sub-btn"
                            type="submit"
                            on:click={subscribe}
                            disabled={subscribed}
                        >
                            Suscribirse
                        </button>
                    </form>
                    <div class="flex items-center justify-center">
                        {#if emailError}<span class="error">
                                {emailError}
                            </span>{/if}
                        {#if subscribed}<span class="success"> ¡Gracias por suscribirte! </span>{/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    .title {
        a {
            color: #fff;
        }
        font-size: 86px;
        text-shadow:
            3px 0 var(--primary),
            -3px 0 var(--primary),
            0 3px var(--primary),
            0 -3px var(--primary),
            3px 3px var(--primary),
            -3px -3px var(--primary),
            3px -3px var(--primary),
            -3px 3px var(--primary);
        margin-bottom: var(--spacing);
    }

    .info {
        padding: calc(var(--spacing) * 2);
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 1rem;
        .unchecked {
            background-image: unset;
            background-color: unset;
        }
        p {
            text-align: justify;
            text-justify: inter-word;
        }
        ul {
            padding: 0;
        }
        li {
            list-style: none;
        }
        input:disabled:checked {
            background-color: var(--primary);
            border-color: var(--primary);
        }
    }

    .srch {
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-bottom: var(--spacing);

        .srch-box {
            margin: 0;
            padding-left: 55px;
            background-color: white;
            border-radius: 1rem;
        }

        .srch-btn {
            position: absolute;
            right: 10px;
            button {
                margin: 0;
                padding: 0 1rem 0 1rem;
                height: 40px;
                border-radius: 0.85rem;
            }
        }
    }

    .email {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .email-input {
            margin: 0;
            padding-left: 55px;
            border-radius: 1rem;
        }
        .sub-btn {
            margin: 0;
            padding: 0 1rem 0 1rem;
            right: 10px;
            width: fit-content;
            height: 40px;
            border-radius: 0.85rem;
        }
    }

    @media only screen and (max-width: 768px) {
        .info {
            padding: var(--spacing);
        }
        .email-input {
            font-size: 0.75rem;
        }
    }

    @media (min-width: 1200px) {
        .container {
            max-width: 920px;
        }
    }

    .error {
        color: red;
    }

    .success {
        color: green;
    }
</style>
