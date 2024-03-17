/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },

    // Base config
    extends: ["eslint:recommended"],

    rules: {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
        "no-unexpected-multiline": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },

    overrides: [
        // React
        {
            files: ["**/*.{js,jsx,ts,tsx}"],
            plugins: ["react", "jsx-a11y", "prettier", "simple-import-sort"],
            extends: [
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:react-hooks/recommended",
                "plugin:jsx-a11y/recommended",
                "eslint-config-prettier",
                "plugin:prettier/recommended",
            ],
            settings: {
                react: {
                    version: "detect",
                },
                formComponents: ["Form"],
                linkComponents: [
                    { name: "Link", linkAttribute: "to" },
                    { name: "NavLink", linkAttribute: "to" },
                ],
                "import/resolver": {
                    typescript: {},
                },
            },
            rules: {
                "simple-import-sort/imports": [
                    "error",
                    {
                        groups: [
                            // Packages `react` related packages come first.
                            ["^react", "^@?\\w"],
                            // Internal packages.
                            ["^(@|core)(/.*|$)"],
                            // Side effect imports.
                            ["^\\u0000"],
                            // Parent imports. Put `..` last.
                            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                            // Other relative imports. Put same-folder imports and `.` last.
                            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                            // Style imports.
                            ["^.+\\.?(css)$"],
                        ],
                    },
                ],
            },
        },

        // Typescript
        {
            files: ["**/*.{ts,tsx}"],
            plugins: ["@typescript-eslint", "import"],
            parser: "@typescript-eslint/parser",
            settings: {
                "import/internal-regex": "^~/",
                "import/resolver": {
                    node: {
                        extensions: [".ts", ".tsx"],
                    },
                    typescript: {
                        alwaysTryTypes: true,
                    },
                },
            },
            extends: ["plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript"],
        },

        // Node
        {
            files: [".eslintrc.cjs"],
            env: {
                node: true,
            },
        },
    ],
};
