<script script lang="ts">
    import {
        collection,
        getDocs,
        onSnapshot,
        orderBy,
        query,
    } from "firebase/firestore";
    import { firestore } from "$lib/firebase";
    import { Nutrients, type Dish } from "$types/dish";
    import { onMount } from "svelte";
    import Modal from "$components/Modal.svelte";

    let dishes: Dish[] = [];
    let selectedDish: Dish;
    let isLoading = true;
    let showModal = false;

    onMount(async () => {
        isLoading = true;
        const dishesRef = collection(firestore, "dishes");
        const dishesQuery = query(dishesRef, orderBy("score", "desc"));
        //subscribe to changes
        onSnapshot(dishesQuery, (snapshot) => {
            dishes = snapshot.docs.map((doc) => {
                const dish = doc.data() as Dish;
                return dish;
            });
            isLoading = false;
        });
    });

    function formatDate(timestamp: number) {
        if (!timestamp) return;
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

<main class="container">
    <h1 class="title primary">
        <a href="/"> ViBite </a>
    </h1>
    {#if dishes && dishes.length > 0}
        <div class="dishes">
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
                        <h4>{dish.name}</h4>
                        <div class="d-flex align-center">
                            <span class="fw-bold dish-price">
                                {`${dish.price} €`}
                            </span>
                            <div
                                class="d-flex p-absolute gap-0-5 top-0 right-0"
                            >
                                <p class="score">
                                    {`${dish.score} / 10`}
                                </p>
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
                        </div>
                    </div>
                </article>
            {/each}
        </div>
    {:else if isLoading}
        <div class="spinner" aria-busy="true" />
    {:else}
        <p>No hay platos disponibles.</p>
    {/if}
</main>

<Modal bind:showModal>
    <div class="ellipsis d-flex align-center justify-center" slot="header">
        <h3 class="primary">{selectedDish?.name}</h3>
    </div>
    <div class="modal-section">
        <div class="d-flex gap-0-5">
            <img src={selectedDish?.imageUrl} alt={selectedDish?.name} />
            {#if selectedDish?.nutrients}
                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            <td class="table-hint">100g</td>
                            <td class="table-hint">Total</td>
                        </tr>
                        {#each Object.entries(selectedDish?.nutrients) as [nutrientName, info]}
                            <tr class="d-flex gap-0-5">
                                <td class="fw-bold"
                                    >{`${Nutrients[nutrientName]}:`}</td
                                >
                                <td>
                                    {`${info.value100} ${info.unit}`}
                                </td>
                                <td>
                                    {`${info.valueTotal} ${info.unit}`}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
        <div class="dish-more-info">
            <div class="d-flex gap-0-5">
                <span class="fw-bold">Ingredientes: </span>
                <p>{selectedDish?.ingredients}</p>
            </div>
            <div class="d-flex gap-0-5">
                <span class="fw-bold">Alérgenos: </span>
                <p>{selectedDish?.allergens}</p>
            </div>
            <span class="fw-bold fs-0-5">
                {`Actualizado: ${formatDate(selectedDish?.updatedAt)}`}
            </span>
            <div class="container">
                {#if selectedDish?.isVegan}
                    <img class="icon" src="" alt="isVegan" />
                {/if}
                {#if selectedDish?.isGlutenFree}
                    <img class="icon" src="" alt="isGlutenFree" />
                {/if}
                {#if selectedDish?.isLactoseFree}
                    <img class="icon" src="" alt="isLactoseFree" />
                {/if}
            </div>
        </div>
    </div>
</Modal>

<style type="text/scss">
    article {
        margin: unset;
        padding: unset;
    }

    h3 {
        margin: unset;
    }

    table {
        display: table;
        border-collapse: collapse;
        border-spacing: 0;
    }

    tbody {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 0.75rem;
        vertical-align: baseline;
    }

    tr {
        display: table-row;
        border-top: 0.1rem solid #9c9d99;
    }

    .disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: pointer;
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

    .table-hint {
        font-weight: bold;
        color: #9c9d99;
    }

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
        font-size: 0.75rem;
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

    .dishes {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .dish {
        flex: 0 0 32%;
        cursor: pointer;
        border-radius: 15px;
        height: 475px;
        position: relative;
    }

    .dish .dish-price {
        position: absolute;
        bottom: 2%;
    }

    .dish:hover {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        transform: scale(0.99);
    }

    .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .dish img {
        border-radius: 15px 15px 0 0;
        object-fit: cover;
        aspect-ratio: 1 / 1;
    }

    .dish h4 {
        font-size: 16px;
        font-weight: bold;
    }

    .modal-section {
        width: 1080px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .modal-section p {
        font-size: 0.75rem;
    }

    .modal-section img {
        width: 50%;
        border-radius: 15px;
    }

    .modal-section .dish-more-info {
        font-size: 0.75rem;
        margin: 20px 5px 0px 5px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .spinner {
        size: 100px;
        position: absolute;
        top: 50%;
        left: 50%;
    }
</style>
