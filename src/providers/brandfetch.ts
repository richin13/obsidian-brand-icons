import { type BrandProvider, providers } from "./provider";

const VARIANT_PATH: Record<string, string> = {
	icon: "",
	logo: "/logo",
	symbol: "/symbol",
};

const brandfetch: BrandProvider = {
	id: "brandfetch",
	name: "Brandfetch",
	supportedVariants: ["icon", "logo", "symbol"],
	defaultVariant: "icon",
	settingsFields: [
		{
			key: "clientId",
			name: "Client ID",
			description:
				"Your Brandfetch client ID from the developer portal.",
			placeholder: "Enter your client ID",
		},
	],
	buildUrl(domain, variant, size, config) {
		const variantPath = VARIANT_PATH[variant] ?? "";
		const params = new URLSearchParams();
		const clientId = config["brandfetch.clientId"];
		if (clientId) {
			params.set("c", clientId);
		}
		params.set("h", String(size));
		return `https://cdn.brandfetch.io/${encodeURIComponent(domain)}${variantPath}?${params.toString()}`;
	},
};

providers.push(brandfetch);
export default brandfetch;
