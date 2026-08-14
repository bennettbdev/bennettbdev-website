import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { siteConfig, siteUrl } from "../src/site.config";
import { ogMarkup, ogOptions } from "../src/utils/og";

const host = new URL(siteUrl).host;

const svg = await satori(
	ogMarkup({
		eyebrow: "Tech Thoughts and Projects",
		title: siteConfig.title,
		byline: siteConfig.description,
		tagsLine: "",
		host,
	}),
	ogOptions,
);

const png = new Resvg(svg).render().asPng();
const out = path.join(process.cwd(), "public", "social-card.png");
fs.writeFileSync(out, png);
console.log(`Wrote ${path.relative(process.cwd(), out)} (${png.length} bytes)`);
