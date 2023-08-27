<script lang="ts">
    import {
        Order,
        OrderTranslation,
        filter,
        orderingCriteria,
    } from "$src/lib/filters";
    import Icon from "@iconify/svelte";
</script>

<nav>
    <ul>
        <li>
            <button
                class={ !$filter.isOpen ? "filter-btn" : "filter-btn-clicked"}
                on:click={() =>
                    filter.update((f) => ({ ...f, isOpen: !f.isOpen }))}
            >
                <Icon icon="carbon:filter" height="48" color="#e84142"></Icon>
            </button>
        </li>
    </ul>
    <ul>
        <li class="absolute-center">
            <h1 class="title primary">
                <a href="/"> ViBite </a>
            </h1>
        </li>
    </ul>
    <ul>
        <li>
            <details role="list">
                <summary>
                    <Icon
                        icon="mi:sort"
                        class="p-absolute"
                        height="24"
                        color="#e84142"
                        style="left: 1rem; top:0.35rem;">
                    </Icon>
                    {OrderTranslation[$orderingCriteria.field]}</summary>
                <ul role="listbox">
                    {#each Object.entries(Order) as [order, value]}
                        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <li
                            on:click={() =>
                                orderingCriteria.update((o) => ({
                                    ...o,
                                    field: value,
                                }))}
                        >
                            {OrderTranslation[value]}
                        </li>
                    {/each}
                </ul>
            </details>
        </li>
        <li>
            <div>
                <button class="profile-btn">
                    <Icon icon="carbon:user" height="48" color="#e84142"></Icon>
                </button>
            </div>
        </li>
    </ul>
</nav>

<style lang="scss">
    nav {
        padding: 0.2rem 1rem 0.2rem 1rem;
        gap: 1rem;
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: white;
    }

    .absolute-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    details {
        width: 240px;
        border: 3px solid var(--primary);
        color: var(--primary);
        font-weight: bold;
        background-color: transparent;
        border-radius: 0.85rem;
        margin: 0 1rem 0 1rem;
        padding: 0.2rem 0 0.2rem 0;
        summary {
            display: block;
            margin: 0 1rem 0 3rem;
            padding: 0 !important;
            border: none;
            color: var(--primary);
            padding: 0;
            &:focus {
                box-shadow: unset;
            }
        }
        ul {
            margin-top: 0.5rem !important;
        }
        li {
            cursor: pointer;
            color: var(--primary);
            font-weight: bold;
            padding: 0.5rem 0.5rem 0.5rem 1rem;
            a {
                background-color: transparent;
            }
            a:hover {
                color: var(--primary);
                background-color: transparent;
            }
        }
    }
    .profile-btn {
        border: 3px solid var(--primary);
        border-radius: 50%;
        background-color: transparent;
    }
    .filter-btn {
        border: 3px solid var(--primary);
        border-radius: 0.85rem;
        background-color: transparent;
    }
    .filter-btn-clicked {
        border: 5px solid var(--primary);
        border-radius: 0.85rem;
        box-shadow: 0 0 0 3px var(--primary);
    }

    button {
        background-color: transparent;
        border: none;
    }
    button:focus {
        box-shadow: unset;
    }
    li,
    ul,
    button,
    h1 {
        margin: 0;
        padding: 0;
    }
    @media only screen and (max-width: 768px) {
        .absolute-center {
            position: relative;
        }
    }

    @media only screen and (max-width: 480px) {
        .absolute-center {
            display: none;
        }

        .profile-btn {
            display: none;
        }
    }
</style>
