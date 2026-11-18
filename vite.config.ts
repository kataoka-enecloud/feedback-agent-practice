import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins, loadEnv, type Plugin } from "vite-plus";

const fireRoutine: Plugin = {
  name: "fire-routine",
  configureServer({ config, ws }) {
    const env = loadEnv(config.mode, config.envDir, "ROUTINE_");
    // No HTTP route on purpose. Vite's HMR token check keeps other sites off this socket.
    ws.on("routine:fire", async (text: string) => {
      try {
        const response = await fetch(env.ROUTINE_FIRE_URL, {
          method: "POST",
          headers: {
            authorization: `Bearer ${env.ROUTINE_TOKEN}`,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
        const result = `${response.status} ${await response.text()}`;
        config.logger[response.ok ? "info" : "error"](`Routine fire: ${result}`);
      } catch (error) {
        config.logger.error(`Routine fire: ${String(error)}`);
      }
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react(), fireRoutine]),
});
