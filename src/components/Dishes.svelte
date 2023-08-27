<script script lang="ts">
    import Modal from "$components/Modal.svelte";
    import NutritionalInfo from "$components/NutritionalInfo.svelte";
    import { filter, search, orderingCriteria } from "$src/lib/filters";
    import { firestore } from "$lib/firebase";
    import type { Dish } from "$types/dish";
    import Icon from "@iconify/svelte";
    import {
        QueryConstraint,
        collection,
        onSnapshot,
        orderBy,
        query,
        where,
    } from "firebase/firestore";

    let dishes: Dish[] = [];
    let selectedDish: Dish;
    let showModal = false;
    $: $filter, loadDishes();
    $: $search, loadDishes();
    $: $orderingCriteria, loadDishes();
    function loadDishes() {
        const queryConditions: QueryConstraint[] = [];
        const dishesRef = collection(firestore, "dishes");
        $search ? queryConditions.push(where("name", ">=", $search)) : null;
        $search ? queryConditions.push(where("name", "<=", $search + "\uf8ff"))
            : null;
        $filter.priceRange
            ? queryConditions.push(where("price", ">=", $filter.priceRange[0]))
            : null;
        $filter.priceRange
            ? queryConditions.push(where("price", "<=", $filter.priceRange[1]))
            : null;
        $filter.nutrientRanges
            ? Object.entries($filter.nutrientRanges).forEach(
                  ([nutrient, range]) => {
                      queryConditions.push(
                          where(`nutrients.${nutrient}`, ">=", range[0]),
                      );
                      queryConditions.push(
                          where(`nutrients.${nutrient}`, "<=", range[1]),
                      );
                  },
              )
            : null;
        $filter.onlyAvailable
            ? queryConditions.push(where("isAvailable", "==", true))
            : null;
        $filter.onlyVegan
            ? queryConditions.push(where("isVegan", "==", true))
            : null;
        $filter.onlyLactoseFree
            ? queryConditions.push(where("isLactoseFree", "==", true))
            : null;
        $filter.onlyGlutenFree
            ? queryConditions.push(where("isGlutenFree", "==", true))
            : null;
        queryConditions.push(
            orderBy($orderingCriteria.field, $orderingCriteria.direction),
        );
        const filterQuery = query(dishesRef, ...queryConditions);

        onSnapshot(filterQuery, (snapshot: any) => {
            dishes = snapshot.docs.map((doc: any) => {
                const dish = doc.data() as Dish;
                dish.id = doc.id;
                return dish;
            });
        });
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
</script>

<main>
    {#if dishes?.length > 0}
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
                    <img src={dish.imageUrl} alt={dish.name} />
                    <div class="p-0-5">
                        <div class="d-flex align-center">
                            <div
                                class="d-flex align-center p-absolute gap-0-5 top-0 right-0"
                            >
                                <span class="score">
                                    {`${dish.score} / 10`}
                                </span>
                                <span
                                    class={dish.nutriScore === "A"
                                        ? "nutriscore dark-green"
                                        : dish.nutriScore === "B"
                                        ? "nutriscore light-green"
                                        : dish.nutriScore === "C"
                                        ? "nutriscore yellow"
                                        : dish.nutriScore === "D"
                                        ? "nutriscore orange"
                                        : "nutriscore red"}
                                >
                                    {dish.nutriScore}
                                </span>
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
    {:else}
        <div class="dishes">
            {#each { length: 9 } as _}
                <article class="dish shimmer"></article>
            {/each}
        </div>
    {/if}
</main>

<Modal bind:showModal>
    <div class="d-flex align-center justify-center" slot="header">
        <h3 class="primary text-capitalize-first">{selectedDish?.name}</h3>
    </div>
    <div class="modal-section">
        <div class="d-flex gap-0-5">
            <div class="p-relative">
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
            <div class="desktop">
                <div class="d-flex gap-0-5">
                    <span class="fw-bold">Ingredientes: </span>
                    <p class="text-capitalize-first">
                        {selectedDish?.ingredients}
                    </p>
                </div>
                <div class="d-flex gap-0-5">
                    <span class="fw-bold">Alérgenos: </span>
                    <p class="text-capitalize-first">
                        {selectedDish?.allergens}
                    </p>
                </div>
            </div>
            <details class="mobile w-100">
                <summary class="fw-bold">Ingredientes</summary>
                <div class="d-flex gap-0-5">
                    <p class="text-capitalize-first">
                        {selectedDish?.ingredients}
                    </p>
                </div>
                <div class="d-flex gap-0-5">
                    <span class="fw-bold">Alérgenos: </span>
                    <p class="text-capitalize-first">
                        {selectedDish?.allergens}
                    </p>
                </div>
            </details>
        </div>
        <a href={selectedDish?.dishUrl} target="_blank" rel="noopener">
            <button class="buy-btn">
                <Icon icon="carbon:shopping-cart" height="24" />
                {`Comprar -  ${selectedDish?.price}€`}
            </button>
        </a>
    </div>
</Modal>

<style lang="scss">
    main {
        height: 100vh;
        overflow: auto;
        padding: 0.5rem 0 0.5rem 0.5rem;
    }

    .dishes-sidebar {
        grid-template-columns: repeat(
            calc(var(--template-columns) - 1),
            minmax(0, 1fr)
        ) !important;
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
                width: 27px;
                height: 30px;
                border-radius: 45%;
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

            img {
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

    @media only screen and (max-width: 768px) {
        .dish {
            flex: 0 0 100%;
        }
        .dish-more-info {
            margin: 0 !important;
        }
        .modal-section {
            width: 100%;
            .d-flex {
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
    }

    .shimmer {
        height: 45vh;
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
