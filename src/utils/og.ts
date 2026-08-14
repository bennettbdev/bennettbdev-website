import fs from "node:fs";
import path from "node:path";
import type { SatoriOptions } from "satori";
import { html } from "satori-html";

const readFont = (name: string) =>
	fs.readFileSync(path.join(process.cwd(), "src", "assets", "fonts", name));

const GeistMonoRegular = readFont("geistmono-regular.ttf");
const GeistMonoSemiBold = readFont("geistmono-semibold.ttf");
const JetBrainsMono = readFont("jetbrainsmono-regular.ttf");

export const ogSize = { width: 1200, height: 630 } as const;

export const ogOptions: SatoriOptions = {
	fonts: [
		{
			data: GeistMonoRegular,
			name: "Geist Mono Variable",
			style: "normal",
			weight: 400,
		},
		{
			data: GeistMonoSemiBold,
			name: "Geist Mono Variable",
			style: "normal",
			weight: 600,
		},
		{
			data: GeistMonoRegular,
			name: "Geist Mono Variable",
			style: "italic",
			weight: 400,
		},
		{ data: JetBrainsMono, name: "JetBrains Mono", style: "normal", weight: 400 },
	],
	...ogSize,
};

export const SEP = " • ";

const titleClass = (title: string) =>
	title.length > 80
		? "text-5xl leading-tight mb-10"
		: title.length > 55
			? "text-6xl leading-tight mb-10"
			: "text-7xl leading-tight mb-10";

export const ogMarkup = (props: {
	eyebrow: string;
	title: string;
	byline: string;
	tagsLine: string;
	host: string;
}) =>
	html`<div
		tw="flex flex-col w-full h-full px-20 py-16"
		style="background-color: #1a1715; font-family: 'Geist Mono Variable';"
	>
		<p
			tw="text-2xl mb-10 tracking-widest uppercase"
			style="font-family: JetBrains Mono; color: #6bc9a0;"
		>
			${props.eyebrow}
		</p>
		<h1 tw="${titleClass(props.title)}" style="color: #fbf6ec; font-weight: 600;">
			${props.title}
		</h1>
		<p tw="text-2xl mb-4" style="font-family: JetBrains Mono; color: #a89c8a;">${props.byline}</p>
		<p tw="text-xl tracking-wider uppercase" style="font-family: JetBrains Mono; color: #6bc9a0;">
			${props.tagsLine}
		</p>
		<div tw="flex flex-1"></div>
		<div tw="flex justify-end w-full">
			<p tw="text-lg tracking-wide" style="font-family: JetBrains Mono; color: #6b5e4f;">
				${props.host}
			</p>
		</div>
	</div>`;
