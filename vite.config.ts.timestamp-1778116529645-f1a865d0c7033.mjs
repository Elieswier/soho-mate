import "node:module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import.meta.url;
//#endregion
//#region vite.config.ts
const __vite_injected_original_dirname = "/sessions/great-vibrant-knuth/mnt/soho-mate";
var vite_config_default = defineConfig(({ mode }) => ({
	server: {
		host: "::",
		port: 8080,
		hmr: { overlay: false }
	},
	plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
	resolve: {
		alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") },
		dedupe: [
			"react",
			"react-dom",
			"react/jsx-runtime",
			"react/jsx-dev-runtime",
			"@tanstack/react-query",
			"@tanstack/query-core"
		]
	}
}));
//#endregion
export { vite_config_default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidml0ZS5jb25maWcuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL3Nlc3Npb25zL2dyZWF0LXZpYnJhbnQta251dGgvbW50L3NvaG8tbWF0ZS92aXRlLmNvbmZpZy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHRhbnN0YWNrL3F1ZXJ5LWNvcmVcIl0sXG4gIH0sXG59KSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsTUFBTSxtQ0FBNkI7QUFNbkMsSUFBQSxzQkFBZSxjQUFjLEVBQUUsWUFBWTtDQUN6QyxRQUFRO0VBQ04sTUFBTTtFQUNOLE1BQU07RUFDTixLQUFLLEVBQ0gsU0FBUyxPQUNWO0VBQ0Y7Q0FDRCxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsaUJBQWlCLGlCQUFpQixDQUFDLENBQUMsT0FBTyxRQUFRO0NBQy9FLFNBQVM7RUFDUCxPQUFPLEVBQ0wsS0FBSyxLQUFLLFFBQUEsa0NBQW1CLFFBQVEsRUFDdEM7RUFDRCxRQUFRO0dBQUM7R0FBUztHQUFhO0dBQXFCO0dBQXlCO0dBQXlCO0dBQXVCO0VBQzlIO0NBQ0YsRUFBRSJ9