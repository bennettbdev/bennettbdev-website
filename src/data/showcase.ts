export interface ShowcaseItem {
	name: string;
	href: string;
	stack: string;
	badge?: string;
	desc: string;
}

export const showcase: ShowcaseItem[] = [
	{
		name: "Shoebill",
		href: "",
		stack: "Rust • Go • SolidJS • Tauri (Framework)",
		badge: "WIP",
		desc: "Clean and fast digital asset manager with extensive organization options. Desktop app is nearing release. Secure & private cloud sync is coming soon.",
	},
	{
		name: "Backpack Bazaar",
		href: "https://github.com/bennettbdev/BackpackBazaar",
		stack: "Python • Django (Framework) • React.js",
		desc: "Open-source marketplace webapp. Includes listing management, rudimentary messaging capabilities, and automatic listing classification using machine learning.",
	},
	{
		name: "Herbs & Spices Mincraft Mod",
		href: "https://github.com/bennettbdev/HerbsAndSpices-1.20.1",
    stack: "Java • Forge",
		badge: "Mod",
		desc: "A Minecraft (1.20.1) mod that adds unique new crops, ores, and more.",
  },
 	{
		name: "Gradient Boosting",
		href: "https://github.com/bennettbdev/GradientBoostingv2",
    stack: "Python • NumPy",
		desc: "Informal write up about gradient boosting (the machine learning technique) and an example implementation that classifies emails as spam or non-spam.",
   },
];
