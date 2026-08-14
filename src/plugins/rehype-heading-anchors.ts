import type { Element, Root } from "hast";
import Slugger from "github-slugger";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const ALL_HEADINGS = /^h[1-6]$/;
const ANCHOR_HEADINGS = /^h[2-4]$/;

function hasClass(node: Element, name: string): boolean {
	const cls = node.properties?.className;
	if (!cls) return false;
	const list = Array.isArray(cls) ? cls.map(String) : String(cls).split(/\s+/);
	return list.includes(name);
}

/**
 * Assigns stable github-slugger ids to every heading and prepends a hover-visible
 * "#" anchor link to h2-h4. Runs before the default rehypeHeadingIds pass, which
 * then skips slugging (ids are already strings) but still collects the headings
 * exposed by render(), so TOC slugs always match the emitted hrefs.
 */
export const rehypeHeadingAnchors: Plugin<[], Root> = () => {
	return (tree) => {
		const slugger = new Slugger();
		visit(tree, "element", (node: Element) => {
			if (!ALL_HEADINGS.test(node.tagName)) return;
			if (hasClass(node, "sr-only")) return;

			const text = mdastToString(node).trim();
			if (!text) return;

			const id = typeof node.properties?.id === "string" ? node.properties.id : slugger.slug(text);

			node.properties = { ...node.properties, id };

			if (!ANCHOR_HEADINGS.test(node.tagName)) return;

			// Empty anchor; the "#" glyph comes from CSS so heading text stays clean.
			node.children.unshift({
				type: "element",
				tagName: "a",
				properties: {
					className: ["heading-anchor"],
					href: `#${id}`,
					ariaLabel: `Link to section: ${text}`,
				},
				children: [],
			});
		});
	};
};
