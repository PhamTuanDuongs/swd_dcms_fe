import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { getLoadContext } from "./load-context";

export default defineConfig({
    plugins: [remixCloudflareDevProxy({ getLoadContext }), remix(), tsconfigPaths()],
});
