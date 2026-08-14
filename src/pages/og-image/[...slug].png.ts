import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site-config";
import { formatBylineDate, formatEyebrowDate } from "@/utils/date";
import { ogMarkup, ogOptions, SEP } from "@/utils/og";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import { render } from "astro:content";
import satori from "satori";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title, tags, readingTime } = context.props as Props;

	const date = new Date(pubDate);
	const authorName = siteConfig.profile?.name ?? siteConfig.author;
	const bylineParts = [
		authorName ? `By ${authorName}` : null,
		formatBylineDate(date),
		readingTime,
	].filter(Boolean) as string[];

	const host = context.site ? new URL(context.site).host : siteConfig.title;

	const svg = await satori(
		ogMarkup({
			eyebrow: `Posts${SEP}${formatEyebrowDate(date)}`,
			title,
			byline: bylineParts.join(SEP),
			tagsLine: tags.join(SEP),
			host,
		}),
		ogOptions,
	);
	const png = new Resvg(svg).render().asPng();
	return new Response(new Uint8Array(png), {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	const filtered = posts.filter(({ data }) => !data.ogImage);
	const items = await Promise.all(
		filtered.map(async (post) => {
			const { remarkPluginFrontmatter } = await render(post);
			const readingTime = (remarkPluginFrontmatter as { minutesRead?: string })?.minutesRead ?? "";
			return {
				params: { slug: post.id },
				props: {
					pubDate: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
					title: post.data.title,
					tags: post.data.tags ?? [],
					readingTime,
				},
			};
		}),
	);
	return items;
}
