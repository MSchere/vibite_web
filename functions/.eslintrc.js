module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: ["@typescript-eslint", "import"],
};
