<script script lang="ts">
    import Modal from "$components/Modal.svelte";
    import NutritionalInfo from "$components/NutritionalInfo.svelte";
    import { firestore } from "$lib/firebase";
    import { filter, orderingCriteria, resetAll, search } from "$src/lib/filters";
    import { Platform, type Dish } from "$types/dish";
    import Icon from "@iconify/svelte";
    import { QueryConstraint, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

    import WetacaLogo from "$lib/static/logos/wetaca.png";
    import TappersLogo from "$lib/static/logos/tappers.png";
    import ProzisLogo from "$lib/static/logos/prozis.png";

    let firstLoad = true;
    let dishes: Dish[] = [];
    let selectedDish: Dish;
    let showModal = false;
    $: $filter, loadDishes();
    $: $search, loadDishes();
    $: $orderingCriteria, loadDishes();

    function getFilterQuery() {
        const queryConditions: QueryConstraint[] = [];
        const dishesRef = collection(firestore, "dishes");
        $search ? queryConditions.push(where("name", ">=", $search)) : null;
        $search ? queryConditions.push(where("name", "<=", $search + "\uf8ff")) : null;
        $filter.priceRange ? queryConditions.push(where("price", ">=", $filter.priceRange[0])) : null;
        $filter.priceRange ? queryConditions.push(where("price", "<=", $filter.priceRange[1])) : null;
        $filter.onlyAvailable ? queryConditions.push(where("isAvailable", "==", true)) : null;
        $filter.onlyVegan ? queryConditions.push(where("isVegan", "==", true)) : null;
        $filter.onlyLactoseFree ? queryConditions.push(where("isLactoseFree", "==", true)) : null;
        $filter.onlyGlutenFree ? queryConditions.push(where("isGlutenFree", "==", true)) : null;
        for (const [nutrient, [min, max]] of Object.entries($filter.nutrientRanges)) {
            if (min !== 0 || max !== 0) {
                queryConditions.push(where(nutrient, ">=", min));
                queryConditions.push(where(nutrient, "<=", max));
            }
        }
        if ($filter.platforms.length > 0) {
            queryConditions.push(where("platform", "in", $filter.platforms));
        } else {
            queryConditions.push(where("platform", "==", ""));
        }
        for (let i = 0; i < $orderingCriteria.length; i++) {
            queryConditions.push(orderBy($orderingCriteria[i].field, $orderingCriteria[i].direction));
        }
        const filterQuery = query(dishesRef, ...queryConditions);
        return filterQuery;
    }

    function loadDishes() {
        try {
            const filterQuery = getFilterQuery();
            onSnapshot(filterQuery, async (snapshot: any) => {
                dishes = snapshot.docs.map((doc: any) => {
                    const dish = doc.data() as Dish;
                    dish.id = doc.id;
                    if (dish) firstLoad = false;
                    return dish;
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    function formatDate(timestamp: number): string {
        if (!timestamp) return "ERROR";
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // function disableDishes() {
    //     const allDishes = collection(firestore, "dishes");
    //     onSnapshot(allDishes, (snapshot: any) => {
    //         snapshot.docs.forEach(async (doc: any) => {
    //             await updateDoc(doc.ref, { isAvailable: false });
    //         });
    //     });
    // }
</script>

<main>
    <!-- <button
        on:click={async (e) => {
            await disableDishes();
        }}>Update dishes</button
    > -->
    {#if dishes.length > 0}
        <div class={!$filter.isOpen ? "dishes" : "dishes dishes-sidebar"}>
            {#each dishes as dish}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <article
                    class={dish.isAvailable === true ? "dish" : "dish disabled"}
                    on:click={() => {
                        selectedDish = dish;
                        showModal = true;
                    }}
                >
                    <img class="dish-img" src={dish.imageUrl} alt={dish.name} />
                    <div class="p-0-5">
                        <div class="flex items-center">
                            <div class="flex justify-between absolute gap-0-5 top-0 left-0 w-full p-0-5">
                                <div class="platform-logo">
                                    <img
                                        src={dish.platform === Platform.WETACA
                                            ? WetacaLogo
                                            : dish.platform === Platform.TAPPERS
                                            ? TappersLogo
                                            : ProzisLogo}
                                        alt={dish.platform}
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <div class="flex gap-0-5 items-center">
                                    <span class="score">
                                        {`${dish.score} / 10`}
                                    </span>
                                    <span
                                        class={`nutriscore ${
                                            dish.nutriScore === "A"
                                                ? "dark-green"
                                                : dish.nutriScore === "B"
                                                ? "light-green"
                                                : dish.nutriScore === "C"
                                                ? "yellow"
                                                : dish.nutriScore === "D"
                                                ? "orange"
                                                : "red"
                                        }`}
                                    >
                                        {dish.nutriScore}
                                    </span>
                                </div>
                            </div>
                            <span class="fw-bold dish-price">
                                {`${dish.price} €`}
                            </span>
                        </div>
                        <h4 class="text-capitalize-first">{dish.name}</h4>
                    </div>
                </article>
            {/each}
        </div>
    {:else if firstLoad}
        <div class="dishes w-screen">
            {#each { length: 15 } as _}
                <article class="dish shimmer"></article>
            {/each}
        </div>
    {:else}
        <div class="w-screen h-screen">
            <div class="reset-filters-box">
                <h4 class="w-full">No hay platos disponibles con los filtros seleccionados</h4>
                <button on:click={() => resetAll()}> Resetear filtros </button>
            </div>
        </div>
    {/if}
</main>

<Modal bind:showModal>
    <div class="flex items-center justify-center" slot="header">
        <h3 class="primary text-capitalize-first">{selectedDish?.name}</h3>
    </div>
    <div class="modal-section">
        <div class="flex gap-0-5">
            <div class="relative">
                <img src={selectedDish?.imageUrl} alt={selectedDish?.name} />
                <span class="timestamp-text">
                    {`Actualizado: ${formatDate(selectedDish?.updatedAt)}`}
                </span>
            </div>
            {#if selectedDish?.nutrients}
                <div class="table-container">
                    <NutritionalInfo {selectedDish} />
                </div>
            {/if}
        </div>
        <div class="dish-more-info">
            <div class="block d-md-none">
                {#if selectedDish?.ingredients}
                    <div class="flex gap-0-5">
                        <span class="fw-bold">Ingredientes: </span>
                        <p class="text-capitalize-first">
                            {selectedDish?.ingredients}
                        </p>
                    </div>
                {/if}
                {#if selectedDish?.allergens}
                    <div class="flex gap-0-5">
                        <span class="fw-bold">Alérgenos: </span>
                        <p class="text-capitalize-first">
                            {selectedDish?.allergens}
                        </p>
                    </div>
                {/if}
            </div>
            <details class="d-none d-mblock w-full">
                <summary class="fw-bold">Ingredientes</summary>
                <div class="flex gap-0-5">
                    <p class="text-capitalize-first">
                        {selectedDish?.ingredients}
                    </p>
                </div>
                {#if selectedDish?.allergens}
                    <div class="flex gap-0-5">
                        <span class="fw-bold">Alérgenos: </span>
                        <p class="text-capitalize-first">
                            {selectedDish?.allergens}
                        </p>
                    </div>
                {/if}
            </details>
        </div>
        <a href={selectedDish?.dishUrl} target="_blank" rel="noopener">
            <button class="buy-btn">
                <Icon icon="carbon:shopping-cart" height="24" />
                {`Comprar en ${selectedDish?.platform} -  ${selectedDish?.price}€`}
            </button>
        </a>
    </div>
</Modal>

<style lang="scss">
    main {
        height: calc(100vh - var(--header-height));
        overflow: auto;
        padding: 0.5rem 0 0.5rem 0.5rem;
    }

    .dishes-sidebar {
        grid-template-columns: repeat(calc(var(--template-columns) - 1), minmax(0, 1fr)) !important;
    }

    .dishes {
        display: grid;
        grid-auto-rows: minmax(0px, 1fr);
        grid-template-columns: repeat(var(--template-columns), minmax(0, 1fr));

        .dish {
            cursor: pointer;
            border-radius: 15px;
            position: relative;
            margin: 0.5rem;
            padding: 0;

            .score {
                text-shadow:
                    1px 0 #fff,
                    -1px 0 #fff,
                    0 1px #fff,
                    0 -1px #fff,
                    1px 1px #fff,
                    -1px -1px #fff,
                    1px -1px #fff,
                    -1px 1px #fff;
                font-size: 0.85rem;
                font-weight: bold;
            }

            .nutriscore {
                width: 25px;
                height: 30px;
                border-radius: 0.5rem;
                border: 1px solid whitesmoke;
                color: whitesmoke;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .dish-price {
                position: absolute;
                bottom: 2%;
            }

            .platform-logo {
                background-color: white;
                border-radius: 0.5rem;
                padding: 0.1rem;
            }

            .dish-img {
                border-radius: 15px 15px 0 0;
                object-fit: cover;
                aspect-ratio: 1 / 1;
            }

            h4 {
                font-size: 16px;
                font-weight: bold;
            }
        }

        .dish:hover {
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            transform: scale(0.99);
        }
    }

    h3 {
        margin: unset;
    }

    .modal-section {
        width: 1080px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .table-container {
            width: 80%;
        }
        img {
            height: 100%;
            width: 100%;
            border-radius: 15px;
        }
        .timestamp-text {
            color: #fcfcfc;
            font-weight: bold;
            font-size: 0.75rem;
            position: absolute;
            bottom: 10px;
            left: 15px;
        }

        .dish-more-info {
            margin: 20px 5px 0px 5px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        details {
            margin: 1rem 0 0 0;
        }

        .buy-btn {
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
    }

    .reset-filters-box {
        width: 480px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        h4 {
            margin: 0;
        }
    }

    .shimmer {
        height: 25vw;
    }

    @media only screen and (max-width: 768px) {
        .dish {
            flex: 0 0 100%;
        }
        .dish-more-info {
            margin: 0 !important;
        }
        .modal-section {
            width: 100%;
            .flex {
                flex-direction: column;
            }

            .table-container {
                width: 100%;
            }

            .timestamp-text {
                top: 10px;
            }

            img {
                width: 100%;
            }
        }
        .reset-filters-box {
            position: fixed;
            top: unset;
            bottom: 10%;
            left: 50%;
        }

        .shimmer {
            height: 60vh;
        }
    }

    .disabled {
        opacity: 0.5;
    }

    .dark-green {
        background-color: #2e7d32;
    }

    .light-green {
        background-color: #66bb6a;
    }

    .yellow {
        background-color: #fbc02d;
    }

    .orange {
        background-color: #ef6c00;
    }

    .red {
        background-color: #d32f2f;
    }
</style>
