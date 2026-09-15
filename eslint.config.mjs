import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Carpetas de build de Next.js renombradas/abandonadas en vez de borradas
    // (backups manuales, limpiezas a medias): sin esto, eslint las escanea
    // como si fueran código fuente propio.
    ".next_old*/**",
    ".next_stale*/**",
    // Worktrees aislados de agentes (Agent tool, isolation: "worktree") y
    // caches locales: copias del repo o perfiles de browser, no código propio.
    ".claude/**",
    ".cache/**",
  ]),
  {
    // Los scripts .cjs de scripts/ son CommonJS a propósito (require() es la
    // sintaxis correcta ahí, no una importación mal hecha).
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
