import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

interface ViteDevServer {
	middlewares: {
		use: (
			fn: (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => void,
		) => void;
	};
}

interface Plugin {
	name: string;
	enforce?: "pre" | "post";
	configureServer: (server: ViteDevServer) => void;
}

const PAGEFIND_DIST = path.resolve("dist/pagefind");
const PAGEFIND_URL = "/pagefind";

export function vitePagefindDev(): Plugin {
	return {
		name: "vite-pagefind-dev",
		enforce: "post",
		configureServer(server: ViteDevServer) {
			if (!fs.existsSync(PAGEFIND_DIST)) {
				console.warn(
					"  ⚠  dist/pagefind/ not found. Search UI won't work in dev.\n" +
						"     Run `pnpm build` once to generate the search index.",
				);
				return;
			}

			server.middlewares.use((req, res: ServerResponse, next) => {
				const url = new URL(req.url ?? "", "http://localhost");
				if (!url.pathname.startsWith(PAGEFIND_URL)) {
					return next();
				}

				const filePath = path.join(PAGEFIND_DIST, url.pathname.replace(PAGEFIND_URL, ""));

				if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
					return next();
				}

				const ext = path.extname(filePath).toLowerCase();
				const mime: Record<string, string> = {
					".js": "application/javascript",
					".css": "text/css",
					".json": "application/json",
					".wasm": "application/wasm",
					".pf_meta": "application/octet-stream",
				};

				res.writeHead(200, { "Content-Type": mime[ext] ?? "application/octet-stream" });
				res.end(fs.readFileSync(filePath));
			});
		},
	};
}
