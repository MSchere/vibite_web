<script lang="ts">
    import {
        NutrientValues100,
        Order,
        filter,
        orderingCriteria,
        search,
    } from "$src/lib/filters";
    import { NutrientNames } from "$src/types/dish";
    import Icon from "@iconify/svelte";
    let priceRange: [number, number] = [0, 0];

    let nutrientRanges: Record<NutrientNames, [number, number]> = {
        [NutrientNames.ENERGY]: [0, 900],
        [NutrientNames.FAT]: [0, 100],
        [NutrientNames.SATFAT]: [0, 100],
        [NutrientNames.PROTEIN]: [0, 100],
        [NutrientNames.CARBS]: [0, 100],
        [NutrientNames.FIBER]: [0, 100],
        [NutrientNames.SUGAR]: [0, 100],
        [NutrientNames.SALT]: [0, 100],
    };

    let checkedNutrients: Record<NutrientNames, boolean> = {
        [NutrientNames.ENERGY]: false,
        [NutrientNames.FAT]: false,
        [NutrientNames.SATFAT]: false,
        [NutrientNames.PROTEIN]: false,
        [NutrientNames.CARBS]: false,
        [NutrientNames.FIBER]: false,
        [NutrientNames.SUGAR]: false,
        [NutrientNames.SALT]: false,
    };

    $: checkedNutrients, updateNutrientRanges();

    function updateSearch(e: Event) {
        const srchValue = (e.target as HTMLInputElement).value.toLowerCase();
        if ($orderingCriteria[0].field !== Order.NAME)
            $orderingCriteria = [
                { field: Order.NAME, direction: "asc" },
                ...$orderingCriteria,
            ];
        $search = srchValue;
    }

    function updatePriceRange(e: Event) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            if ($orderingCriteria[0].field !== Order.PRICE)
                $orderingCriteria = [
                    { field: Order.PRICE, direction: "asc" },
                    ...$orderingCriteria,
                ];
            $filter = {
                ...$filter,
                priceRange,
            };
        } else {
            if ($orderingCriteria[0].field === Order.PRICE)
                $orderingCriteria = $orderingCriteria.slice(1);
            $filter = {
                ...$filter,
                priceRange: undefined,
            };
        }
    }

    function updateNutrientRanges() {
        for (const [nutrient, [min, max]] of Object.entries(nutrientRanges)) {
            const key =
                Object.keys(NutrientNames).find(
                    (k) => NutrientNames[k] === nutrient,
                ) ?? "";
            const dbField = NutrientValues100[key];
            if (checkedNutrients[nutrient]) {
                if ($orderingCriteria[0].field !== dbField)
                    $orderingCriteria = [
                        { field: dbField, direction: "desc" },
                        ...$orderingCriteria,
                    ];

                $filter = {
                    ...$filter,
                    nutrientRanges: {
                        ...$filter.nutrientRanges,
                        [dbField]: [min, max],
                    },
                };
            } else {
                if ($orderingCriteria[0].field === dbField)
                    $orderingCriteria = $orderingCriteria.slice(1);
                $filter = {
                    ...$filter,
                    nutrientRanges: {
                        ...$filter.nutrientRanges,
                        [dbField]: [0, 0],
                    },
                };
            }
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
                    <summary class="fw-bold"
                        >Precio <span class="fs-0-75">(€)</span></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                placeholder="Min"
                                bind:value={priceRange[0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
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
                    <summary class="fw-bold"
                        >Energía <span class="fs-0-75">(Kcal / 100g)</span
                        ></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="500"
                                step="25"
                                placeholder="Min"
                                bind:value={nutrientRanges[
                                    NutrientNames.ENERGY
                                ][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="500"
                                step="25"
                                placeholder="Max"
                                bind:value={nutrientRanges[
                                    NutrientNames.ENERGY
                                ][1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedNutrients[
                                NutrientNames.ENERGY
                            ]}
                        />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold"
                        >Proteínas <span class="fs-0-75">(g / 100g)</span
                        ></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[
                                    NutrientNames.PROTEIN
                                ][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[
                                    NutrientNames.PROTEIN
                                ][1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedNutrients[
                                NutrientNames.PROTEIN
                            ]}
                        />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold"
                        >Carbohidratos <span class="fs-0-75">(g / 100g)</span
                        ></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[
                                    NutrientNames.CARBS
                                ][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[
                                    NutrientNames.CARBS
                                ][1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedNutrients[NutrientNames.CARBS]}
                        />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold"
                        >Grasas <span class="fs-0-75">(g / 100g)</span></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[
                                    NutrientNames.FAT
                                ][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[
                                    NutrientNames.FAT
                                ][1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedNutrients[NutrientNames.FAT]}
                        />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold"
                        >Sal <span class="fs-0-75">(g / 100g)</span></summary
                    >
                    <div class="filter-range">
                        <div class="d-flex align-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[
                                    NutrientNames.SALT
                                ][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[
                                    NutrientNames.SALT
                                ][1]}
                            />
                        </div>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedNutrients[NutrientNames.SALT]}
                        />
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
    details[open] > summary:not([role]):not(:focus) {
        color: var(--accordion-close-summary-color);
    }

    details {
        padding: 0.5rem;
        border-top: 1px solid var(--form-element-border-color);
        border-bottom: none;
        summary {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            span {
                color: var(--accordion-open-summary-color);
            }
        }
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
