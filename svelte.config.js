import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        alias: {
            $src: "./src",
            $assets: "./src/assets",
            $styles: "./src/styles",
            $components: "./src/components",
            $types: "./src/types",
        },
        adapter: adapter(),
    },
};

export default config;
