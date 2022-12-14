import {rmSync} from "fs";
import {resolve} from "path";
import {defineConfig, Plugin, UserConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import pkg from "./package.json";
import Components from "unplugin-vue-components/vite";
import {NaiveUiResolver} from "unplugin-vue-components/resolvers";
import usePluginImport from 'vite-plugin-importer'

rmSync("dist", {recursive: true, force: true}); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    electron({
      main: {
        entry: "electron/main/index.ts",
        vite: withDebug({
          build: {
            outDir: "dist/electron/main",
          },
        }),
      },
      // Enables use of Node.js API in the Renderer-process
      renderer: {},
    }),
    usePluginImport({
      libraryName: '@icon-park/vue-next',
      libraryDirectory: 'es/icons',
      camel2DashComponentName: false // default: true,
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/*": resolve(__dirname, "src/*"),
    },
  },
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8899",
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
});

function withDebug(config: UserConfig): UserConfig {
  if (process.env.VSCODE_DEBUG) {
    if (!config.build) config.build = {};
    config.build.sourcemap = true;
    config.plugins = (config.plugins || []).concat({
      name: "electron-vite-debug",
      configResolved(config) {
        const index = config.plugins.findIndex(p => p.name === "electron-main-watcher");
        // At present, Vite can only modify plugins in configResolved hook.
        (config.plugins as Plugin[]).splice(index, 1);
      },
    });
  }
  return config;
}
