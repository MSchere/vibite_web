<script script lang="ts">
    import Modal from "$components/Modal.svelte";
    import NutritionalInfo from "$components/NutritionalInfo.svelte";
    import { filter } from "$lib/filter";
    import { firestore } from "$lib/firebase";
    import type { Dish } from "$types/dish";
    import Icon from "@iconify/svelte";
    import {
        QueryConstraint,
        collection,
        onSnapshot,
        orderBy,
        query,
        where
    } from "firebase/firestore";
    import { onMount } from "svelte";

    let dishes: Dish[] = [];
    let selectedDish: Dish;
    let showModal = false;

    function loadDishes() {
        const f = $filter;
        const queryConditions: QueryConstraint[] = [];
        const dishesRef = collection(firestore, "dishes");
        f.search ? queryConditions.push(where("name", ">=", f.search)) : null;
        f.priceRange ? queryConditions.push(where("price", ">=", f.priceRange[0])) : null;
        f.priceRange ? queryConditions.push(where("price", "<=", f.priceRange[1])) : null;
        f.nutrientRanges ? Object.entries(f.nutrientRanges).forEach(([nutrient, range]) => {
            queryConditions.push(where(`nutrients.${nutrient}`, ">=", range[0]));
            queryConditions.push(where(`nutrients.${nutrient}`, "<=", range[1]));
        }) : null;
        f.onlyAvailable ? queryConditions.push(where("isAvailable", "==", true)) : null;
        f.onlyVegan ? queryConditions.push(where("isVegan", "==", true)) : null;
        f.onlyLactoseFree ? queryConditions.push(where("isLactoseFree", "==", true)) : null;
        f.onlyGlutenFree ? queryConditions.push(where("isGlutenFree", "==", true)) : null;
        f.orderingCriteria ? queryConditions.push(orderBy(f.orderingCriteria, f.orderingDirection)) : null;
        
        const filterQuery = query(
            dishesRef,
            ...queryConditions
        );

        onSnapshot(filterQuery, (snapshot: any) => {
            dishes = snapshot.docs.map((doc: any) => {
                const dish = doc.data() as Dish;
                return dish;
            });
        });

    }

    onMount(async () => {
        loadDishes();
    });

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
    <div class="container">
        <h1 class="title primary">
            <a href="/"> ViBite </a>
        </h1>
        {#if dishes?.length > 0}
            <div class="dishes">
                {#each dishes as dish}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <article
                        class={dish.isAvailable === true
                            ? "dish"
                            : "dish disabled"}
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
                            <h4>{dish.name}</h4>
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
    </div>
</main>

<Modal bind:showModal>
    <div class="d-flex align-center justify-center" slot="header">
        <h3 class="primary">{selectedDish?.name}</h3>
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
                    <p>{selectedDish?.ingredients}</p>
                </div>
                <div class="d-flex gap-0-5">
                    <span class="fw-bold">Alérgenos: </span>
                    <p>{selectedDish?.allergens}</p>
                </div>
            </div>
            <details class="mobile w-100">
                <summary class="fw-bold">Ingredientes</summary>
                <div class="d-flex gap-0-5">
                    <p>{selectedDish?.ingredients}</p>
                </div>
                <div class="d-flex gap-0-5">
                    <span class="fw-bold">Alérgenos: </span>
                    <p>{selectedDish?.allergens}</p>
                </div>
            </details>
        </div>
        <a href={selectedDish?.dishUrl} target="_blank" rel="noopener">
            <button class="buy-btn">
                <Icon icon="typcn:shopping-cart" height="24" />
                {`Comprar -  ${selectedDish?.price}€`}
            </button>
        </a>
    </div>
</Modal>

<style lang="scss">
    .dishes {
        display: grid;
        grid-auto-rows: minmax(0px, 1fr);
        grid-template-columns: repeat(var(--template-columns), minmax(0, 1fr));
        gap: 1rem;

        .dish {
            cursor: pointer;
            border-radius: 15px;
            position: relative;
            margin: 0;
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
