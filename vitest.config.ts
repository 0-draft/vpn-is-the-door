/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // The on-disk module cache misses files added to an import.meta.glob (src/data/sources/*.json).
    fsModuleCache: false,
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/i18n/**", "src/data/*.ts"],
    },
  },
});
