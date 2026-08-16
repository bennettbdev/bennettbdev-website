import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const siteUrl = "https://bennettbeltran.com";

export const siteConfig: SiteConfig = {
	author: "Bennett",
	date: {
		locale: "en-US",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	description:
    "A blog where I post my tech-related ramblings and projects. I mainly focus on backend development, but there are many parts of the tech world that I want to learn and explore.",
	lang: "en-US",
	ogLocale: "en_US",
	sortPostsByUpdatedDate: false,
	title: "bennettbdev",
	hideThemeCredit: false,
	pagefind: true,
	profile: {
		name: "Bennett",
		email: "bennettbdev+site@protonmail.com",
		github: "https://github.com/bennettbdev",
		linkedin: undefined,
		jobTitle: "Software Engineer",
		employer: undefined,
		employerUrl: undefined,
		alumni: undefined,
		avatar: undefined,
	},
	// Uncomment to enable analytics. Loads via Partytown.
	// analytics: {
	// 	goatcounterUrl: "https://your-handle.goatcounter.com/count",
	// },
	// Uncomment to enable webmentions. Also add WEBMENTION_API_KEY to .env.
	// webmentions: {
	// 	link: "https://webmention.io/badstro/webmention",
	// 	pingback: "https://webmention.io/badstro/xmlrpc",
	// },
};

export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "home",
	},
	{
		path: "/posts/",
		title: "posts",
	},
	{
		path: "/showcase/",
		title: "showcase",
	},
	{
		path: "/about/",
		title: "about",
	},
];

export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	styleOverrides: {
		borderRadius: "4px",
		codeBackground: ({ theme }) => (theme.type === "light" ? "#f0e9d6" : "#1a1715"),
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
		codeFontSize: "0.875rem",
		codeLineHeight: "1.7142857rem",
		codePaddingInline: "1rem",
		frames: {
			editorActiveTabBackground: ({ theme }) => (theme.type === "light" ? "#f0e9d6" : "#1a1715"),
			editorTabBarBackground: ({ theme }) => (theme.type === "light" ? "#ebe3cd" : "#15120e"),
			frameBoxShadowCssValue: "none",
			terminalBackground: ({ theme }) => (theme.type === "light" ? "#f0e9d6" : "#1a1715"),
			terminalTitlebarBackground: ({ theme }) => (theme.type === "light" ? "#ebe3cd" : "#15120e"),
		},
		uiLineHeight: "inherit",
	},
	themeCssSelector(theme, { styleVariants }) {
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
		}
		return `[data-theme="${theme.name}"]`;
	},
	themes: ["min-dark", "min-light"],
	useThemedScrollbars: false,
};
