<script lang="ts">
    import Icon from "@iconify/svelte";
    import { orderingCriteria, filter, Order, search } from "$src/lib/filters";
    import { NutrientNames } from "$src/types/dish";
    let priceRange: [number, number] = [0, 0];

    let nutrientRanges: Record<NutrientNames, [number, number]> = {
        [NutrientNames.ENERGY]: [0, 0],
        [NutrientNames.FAT]: [0, 0],
        [NutrientNames.SATFAT]: [0, 0],
        [NutrientNames.PROTEIN]: [0, 0],
        [NutrientNames.CARBS]: [0, 0],
        [NutrientNames.FIBER]: [0, 0],
        [NutrientNames.SUGAR]: [0, 0],
        [NutrientNames.SALT]: [0, 0],
    };

    function updateSearch(e: Event) {
        const srchValue = (e.target as HTMLInputElement).value.toLowerCase();
        if ($orderingCriteria.field !== Order.NAME)
            orderingCriteria.update((o) => ({ ...o, field: Order.NAME }));
        search.update((s) => srchValue);
    }
    function updatePriceRange(e: Event) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            if ($orderingCriteria.field !== Order.PRICE)
                orderingCriteria.update((o) => ({ ...o, field: Order.PRICE }));
            filter.update((f) => ({
                ...f,
                priceRange,
            }));
        } else {
            filter.update((f) => ({
                ...f,
                priceRange: undefined,
            }));
        }
    }
    function updateNutrientRange(e: Event) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            if ($orderingCriteria.field !== Order.ENERGY)
                orderingCriteria.update((o) => ({ ...o, field: Order.ENERGY }));
            filter.update((f) => ({
                ...f,
                nutrientRanges,
            }));
        } else {
            filter.update((f) => ({
                ...f,
                nutrientRanges: undefined,
            }));
        }

    }
</script>

<aside class={$filter.isOpen === true ? "open" : "d-none"}>
    <nav>
        <ul>
            <li>
                <div class="d-flex flex-column align-center">
                    <div class="srch">
                        <Icon
                            icon="carbon:search"
                            class="p-absolute"
                            height="24"
                            style="left: 1rem;"
                        ></Icon>
                        <input
                            type="text"
                            class="srch-box"
                            placeholder="Buscar platos.."
                            on:keyup={updateSearch}
                        />
                    </div>
                </div>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Precio (€)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                                bind:value={priceRange[0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                                bind:value={priceRange[1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            on:click={updatePriceRange}
                        />
                    </div>
                </details>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Energía (Kcal)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientNames.ENERGY][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientNames.ENERGY][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox"/>
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Proteínas (g)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                            />
                        </div>
                        <input class="checkbox" type="checkbox" />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Carbohidratos (g)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                            />
                        </div>
                        <input class="checkbox" type="checkbox" />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Grasas (g)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                            />
                        </div>
                        <input class="checkbox" type="checkbox" />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Sal (g)</summary>
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Min"
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                placeholder="Max"
                            />
                        </div>
                        <input class="checkbox" type="checkbox" />
                    </div>
                </details>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Filtros</summary>
                    <div class="filter-field">
                        <span>Activos</span>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={$filter.onlyAvailable}
                        />
                    </div>
                    <div class="filter-field">
                        <span>Vegano</span>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={$filter.onlyVegan}
                        />
                    </div>
                    <div class="filter-field">
                        <span>Sin gluten</span>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={$filter.onlyGlutenFree}
                        />
                    </div>
                    <div class="filter-field">
                        <span>Sin lactosa</span>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={$filter.onlyLactoseFree}
                        />
                    </div>
                </details>
            </li>
        </ul>
    </nav>
</aside>

<style lang="scss">
    .open {
        min-width: 420px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        nav {
            height: 100%;
            width: 100%;
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
    }
    details {
        padding: 0.5rem;
        border-top: 1px solid var(--form-element-border-color);

        .filter-range {
            gap: 1.5rem;
            margin: 1rem 0 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                color: var(--accordion-open-summary-color);
            }
        }

        .filter-field {
            margin: 1rem 0 0 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-weight: bold;
                color: var(--accordion-open-summary-color);
            }
        }
        .range-input {
            height: 40px;
            width: 100px;
        }
        .checkbox {
            margin: 0;
            height: 40px;
            width: 40px;
        }
    }
    @media only screen and (max-width: 768px) {
        .open {
            min-width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
</style>
