// vitest.config.ts
import { defineConfig } from "file:///D:/Codebox/__NPM__/FormKeeper/node_modules/vitest/dist/config.js";
var vitest_config_default = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"],
      exclude: [
        "tests/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "examples/**",
        "website/**",
        "dist/**",
        "node_modules/**",
        "**/*.config.*",
        "**/types.ts"
      ],
      // CRITICAL: 100% coverage required
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
      all: true,
      include: ["src/**/*.{ts,tsx}"]
    },
    include: ["tests/**/*.test.{ts,tsx}"]
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXENvZGVib3hcXFxcX19OUE1fX1xcXFxGb3JtS2VlcGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDb2RlYm94XFxcXF9fTlBNX19cXFxcRm9ybUtlZXBlclxcXFx2aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlYm94L19fTlBNX18vRm9ybUtlZXBlci92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogW10sXG5cbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2h0bWwnLCAnbGNvdicsICdqc29uJ10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICd0ZXN0cy8qKicsXG4gICAgICAgICcqKi8qLnRlc3QudHMnLFxuICAgICAgICAnKiovKi50ZXN0LnRzeCcsXG4gICAgICAgICdleGFtcGxlcy8qKicsXG4gICAgICAgICd3ZWJzaXRlLyoqJyxcbiAgICAgICAgJ2Rpc3QvKionLFxuICAgICAgICAnbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgJyoqLyouY29uZmlnLionLFxuICAgICAgICAnKiovdHlwZXMudHMnLFxuICAgICAgXSxcblxuICAgICAgLy8gQ1JJVElDQUw6IDEwMCUgY292ZXJhZ2UgcmVxdWlyZWRcbiAgICAgIGxpbmVzOiAxMDAsXG4gICAgICBmdW5jdGlvbnM6IDEwMCxcbiAgICAgIGJyYW5jaGVzOiAxMDAsXG4gICAgICBzdGF0ZW1lbnRzOiAxMDAsXG5cbiAgICAgIGFsbDogdHJ1ZSxcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3RzLHRzeH0nXSxcbiAgICB9LFxuXG4gICAgaW5jbHVkZTogWyd0ZXN0cy8qKi8qLnRlc3Que3RzLHRzeH0nXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFSLFNBQVMsb0JBQW9CO0FBRWxULElBQU8sd0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQztBQUFBLElBRWIsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFHQSxPQUFPO0FBQUEsTUFDUCxXQUFXO0FBQUEsTUFDWCxVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsTUFFWixLQUFLO0FBQUEsTUFDTCxTQUFTLENBQUMsbUJBQW1CO0FBQUEsSUFDL0I7QUFBQSxJQUVBLFNBQVMsQ0FBQywwQkFBMEI7QUFBQSxFQUN0QztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
