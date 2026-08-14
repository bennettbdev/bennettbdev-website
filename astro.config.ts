import fs from "node:fs";
import path from "node:path";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import { expressiveCodeOptions, siteConfig, siteUrl } from "./src/site.config";
import partytown from "@astrojs/partytown";

import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { rehypeBasePath } from "./src/plugins/rehype-base-path";
import { rehypeHeadingAnchors } from "./src/plugins/rehype-heading-anchors";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions";
import { remarkReadingTime } from "./src/plugins/remark-reading-time";
import { vitePagefindDev } from "./src/plugins/vite-pagefind-dev";

import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeUnwrapImages from "rehype-unwrap-images";

// Defaults to root; the deploy workflow sets BASE_PATH for subpath hosts
// (GitHub Pages project sites). See "Base path" in the README.
const BASE_PATH = process.env.BASE_PATH || "/";
const START_URL = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;

const SITE_URL = siteUrl;

/**
 * `lastmod` per post URL, derived from each post's frontmatter
 * (`updatedDate` when present, else `publishDate`). Posts are read straight
 * from disk because `astro:content` isn't available in the config file.
 */
const postLastmods = getPostLastmods();

function getPostLastmods(): Map<string, string> {
	const postsDir = path.join(process.cwd(), "src", "content", "post");
	const lastmods = new Map<string, string>();
	if (!fs.existsSync(postsDir)) return lastmods;
	for (const file of fs.readdirSync(postsDir)) {
		if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
		const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
		const publishDate = parseFrontmatterDate(raw, "publishDate");
		if (!publishDate) continue;
		const updatedDate = parseFrontmatterDate(raw, "updatedDate");
		const slug = file.replace(/\.mdx?$/, "");
		lastmods.set(
			`${SITE_URL}${START_URL}posts/${slug}/`,
			(updatedDate ?? publishDate).toISOString(),
		);
	}
	return lastmods;
}

/** Minimal frontmatter scalar reader. */
function parseFrontmatterDate(raw: string, key: string): Date | undefined {
	const match = new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m").exec(raw);
	if (!match) return undefined;
	const value = match[1].trim().replace(/^["']|["']$/g, "");
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.valueOf()) ? undefined : date;
}

export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	image: {
		domains: ["webmention.io"],
	},
	output: "static",
	compressHTML: true,
	build: {
		inlineStylesheets: "always",
	},
	integrations: [
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		expressiveCode(expressiveCodeOptions),
		icon(),
		sitemap({
			changefreq: "weekly",
			priority: 0.7,
			serialize(item) {
				const lastmod = postLastmods.get(item.url);
				if (lastmod) item.lastmod = lastmod;
				return item;
			},
		}),
		mdx(),
		robotsTxt(),
		webmanifest({
			// See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
			name: siteConfig.title,
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/icon.png",
			icons: [
				{
					src: "icons/apple-touch-icon.png",
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: START_URL,
			background_color: "#131110",
			theme_color: "#6bc9a0",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
		(await import("@playform/compress")).default(),
	],
	// Astro 7 defaults to Sätteri; opt back into remark/rehype. Plugins go
	// inside unified() only — top-level arrays would double-run them.
	markdown: {
		processor: unified({
			rehypePlugins: [
				rehypeHeadingAnchors,
				rehypeUnwrapImages,
				[rehypeBasePath, { base: BASE_PATH }],
				// rehype-katex must run before rehype-external-links so the latter
				// doesn't rewrite anchors inside katex's emitted DOM.
				rehypeKatex,
				[
					rehypeExternalLinks,
					{
						rel: ["nofollow, noreferrer"],
						target: "_blank",
					},
				],
			],
			remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions, remarkMath],
			remarkRehype: {
				footnoteLabelProperties: {
					className: [""],
				},
			},
		}),
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [
			tailwindcss(),
			rawFonts([".ttf", ".woff"]),
			...(siteConfig.pagefind !== false ? [vitePagefindDev()] : []),
		],
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
