<script lang="ts">
    import { NutrientValues100, Order, filter, orderingCriteria, search } from "$src/lib/filters";
    import { NutrientName, Platform } from "$src/types/dish";
    import Icon from "@iconify/svelte";
    let priceRange: [number, number] = [0, 0];

    let nutrientRanges: Record<NutrientName, [number, number]> = {
        [NutrientName.ENERGY]: [0, 900],
        [NutrientName.FAT]: [0, 100],
        [NutrientName.SATFAT]: [0, 100],
        [NutrientName.PROTEIN]: [0, 100],
        [NutrientName.CARBS]: [0, 100],
        [NutrientName.FIBER]: [0, 100],
        [NutrientName.SUGAR]: [0, 100],
        [NutrientName.SALT]: [0, 100],
    };

    let checkedNutrients: Record<NutrientName, boolean> = {
        [NutrientName.ENERGY]: false,
        [NutrientName.FAT]: false,
        [NutrientName.SATFAT]: false,
        [NutrientName.PROTEIN]: false,
        [NutrientName.CARBS]: false,
        [NutrientName.FIBER]: false,
        [NutrientName.SUGAR]: false,
        [NutrientName.SALT]: false,
    };

    let checkedPlatforms: Record<Platform, boolean> = {
        [Platform.WETACA]: true,
        [Platform.TAPPERS]: true,
        [Platform.PROZIS]: false,
        [Platform.NOCOCINOMAS]: false,
        [Platform.MENUDIET]: false,
        [Platform.GUISOS]: false,
        [Platform.KNOWEATS]: false,
        [Platform.MIPLATO]: false,
    };

    $: checkedNutrients, updateNutrientRanges();
    $: checkedPlatforms, updatePlatforms();

    function updateSearch(e: Event) {
        const srchValue = (e.target as HTMLInputElement).value.toLowerCase();
        if ($orderingCriteria[0].field !== Order.NAME)
            $orderingCriteria = [{ field: Order.NAME, direction: "asc" }, ...$orderingCriteria];
        $search = srchValue;
    }

    function updatePriceRange(e: Event) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            if ($orderingCriteria[0].field !== Order.PRICE)
                $orderingCriteria = [{ field: Order.PRICE, direction: "asc" }, ...$orderingCriteria];
            $filter = {
                ...$filter,
                priceRange,
            };
        } else {
            if ($orderingCriteria[0].field === Order.PRICE) $orderingCriteria = $orderingCriteria.slice(1);
            $filter = {
                ...$filter,
                priceRange: undefined,
            };
        }
    }

    function updateNutrientRanges() {
        for (const [nutrient, [min, max]] of Object.entries(nutrientRanges)) {
            const key = Object.keys(NutrientName).find((k) => NutrientName[k] === nutrient) ?? "";
            const dbField = NutrientValues100[key];
            if (checkedNutrients[nutrient]) {
                if ($orderingCriteria[0].field !== dbField)
                    $orderingCriteria = [{ field: dbField, direction: "desc" }, ...$orderingCriteria];

                $filter = {
                    ...$filter,
                    nutrientRanges: {
                        ...$filter.nutrientRanges,
                        [dbField]: [min, max],
                    },
                };
            } else {
                if ($orderingCriteria[0].field === dbField) $orderingCriteria = $orderingCriteria.slice(1);
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

    function updatePlatforms() {
        for (const [platform, isChecked] of Object.entries(checkedPlatforms)) {
            if (isChecked) {
                if (!$filter.platforms.includes(platform as Platform)) {
                    $filter.platforms = [...$filter.platforms, platform as Platform];
                }
            } else {
                if ($filter.platforms.includes(platform as Platform)) {
                    $filter.platforms = $filter.platforms.filter((p) => p !== platform);
                }
            }
        }
    }
</script>

<aside class={$filter.isOpen === true ? "open" : "d-none"}>
    <nav>
        <ul>
            <li>
                <div class="flex flex-column items-center">
                    <div class="srch">
                        <Icon icon="carbon:search" class="absolute" height="24" style="left: 1rem;"></Icon>
                        <input type="text" class="srch-box" placeholder="Buscar platos.." on:keyup={updateSearch} />
                    </div>
                </div>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Precio <span class="fs-0-75">(€)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
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
                        <input class="checkbox" type="checkbox" on:click={updatePriceRange} />
                    </div>
                </details>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Energía <span class="fs-0-75">(Kcal / 100g)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="500"
                                step="25"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientName.ENERGY][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="500"
                                step="25"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientName.ENERGY][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox" bind:checked={checkedNutrients[NutrientName.ENERGY]} />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Proteínas <span class="fs-0-75">(g / 100g)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientName.PROTEIN][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientName.PROTEIN][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox" bind:checked={checkedNutrients[NutrientName.PROTEIN]} />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Carbohidratos <span class="fs-0-75">(g / 100g)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientName.CARBS][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientName.CARBS][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox" bind:checked={checkedNutrients[NutrientName.CARBS]} />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Grasas <span class="fs-0-75">(g / 100g)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientName.FAT][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientName.FAT][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox" bind:checked={checkedNutrients[NutrientName.FAT]} />
                    </div>
                </details>
            </li>
            <li>
                <details>
                    <summary class="fw-bold">Sal <span class="fs-0-75">(g / 100g)</span></summary>
                    <div class="filter-range">
                        <div class="flex items-center gap-0-5">
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Min"
                                bind:value={nutrientRanges[NutrientName.SALT][0]}
                            />
                            <span>to</span>
                            <input
                                class="range-input"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Max"
                                bind:value={nutrientRanges[NutrientName.SALT][1]}
                            />
                        </div>
                        <input class="checkbox" type="checkbox" bind:checked={checkedNutrients[NutrientName.SALT]} />
                    </div>
                </details>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Filtros</summary>
                    <div class="filter-field">
                        <span>Activos</span>
                        <input class="checkbox" type="checkbox" bind:checked={$filter.onlyAvailable} />
                    </div>
                    <div class="filter-field">
                        <span>Vegano</span>
                        <input class="checkbox" type="checkbox" bind:checked={$filter.onlyVegan} />
                    </div>
                    <div class="filter-field">
                        <span>Sin gluten</span>
                        <input class="checkbox" type="checkbox" bind:checked={$filter.onlyGlutenFree} />
                    </div>
                    <div class="filter-field">
                        <span>Sin lactosa</span>
                        <input class="checkbox" type="checkbox" bind:checked={$filter.onlyLactoseFree} />
                    </div>
                </details>
            </li>
            <li>
                <details open>
                    <summary class="fw-bold">Plataformas</summary>
                    <div class="filter-field">
                        <span>Wetaca</span>
                        <input class="checkbox" type="checkbox" bind:checked={checkedPlatforms[Platform.WETACA]} />
                    </div>
                    <div class="filter-field">
                        <span>Tappers.es</span>
                        <input class="checkbox" type="checkbox" bind:checked={checkedPlatforms[Platform.TAPPERS]} />
                    </div>
                    <div class="filter-field">
                        <span>Prozis</span>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={checkedPlatforms[Platform.PROZIS]}
                            disabled={true}
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
