import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { macroPlugin } from "@builder.io/vite-plugin-macro";

export default defineConfig(() => {
  return {
    plugins: [
      macroPlugin({ preset: "pandacss" }),
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
    ],
		// server: {
		// 	proxy: {
		// 	'/api': {
		// 	target: 'http://localhost:3000/',
		// 	changeOrigin: true,
		// 	cookiePathRewrite: {
		// 		"*": "/",
		// 	}
		// 	}
		// 	}
		// 	},
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
			
    },
  };
});
