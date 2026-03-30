// @ts-check
import eslintConfigPrettier from "eslint-config-prettier";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    name: "app/project-rules",
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "vue/attributes-order": "off",
      "vue/attribute-hyphenation": "off",
      "vue/no-template-shadow": "off",
      "vue/no-required-prop-with-default": "off",
      "vue/require-default-prop": "off",
      "vue/v-on-event-hyphenation": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
    },
  },
  {
    name: "app/typescript-rules",
    files: ["**/*.{ts,vue}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintConfigPrettier,
);
