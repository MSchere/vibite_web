<script script lang="ts">
    export let showModal = false;

    let dialog: HTMLDialogElement;

    $: if (dialog && showModal) {
        dialog.showModal();
        dialog.scrollTop = 0;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation>
        <slot name="header" />
        <hr />
        <slot />
        <!-- svelte-ignore a11y-autofocus -->
        <button id="close-btn" class="outline" autofocus on:click={() => dialog.close()}>Cerrar</button>
    </div>
</dialog>

<style>
    dialog {
        max-width: 32rem;
        border-radius: 0.2rem;
        border: none;
        padding: 0;
    }
    dialog::backdrop {
        background: unset !important;
    }
    dialog > div {
        background-color: white;
        border-radius: 1rem;
        padding: 1rem;
    }
    #close-btn {
        display: none;
    }
    dialog[open] > div {
        animation: zoom 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.1s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media only screen and (max-width: 768px) {
        dialog > div {
            position: absolute;
            border-radius: 0;
            top: 0px !important;
            height: fit-content;
        }
        #close-btn {
            /* outline */
            margin: 10px 0 0 0;
            display: block !important;
        }
    }
</style>
