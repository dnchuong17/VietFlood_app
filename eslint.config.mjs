import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      ".expo/**",
      ".eas/**",
    ],
  },
  {
    rules: {
      // TypeScript strict mode
      "@typescript-eslint/no-explicit-any": ["warn"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Import organization - organize imports
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // Disable rules not applicable to React Native
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
    },
  },
])

export default eslintConfig
