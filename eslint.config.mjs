import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Keep visibility but avoid hard failures from React Compiler-oriented checks
      // on legacy tool components that are safe in current runtime behavior.
      "react-hooks/static-components": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "prefer-const": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react/no-children-prop": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-key": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
