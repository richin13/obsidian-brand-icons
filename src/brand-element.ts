import type { BrandToken } from "./parse";
import type { BrandIconSettings } from "./settings";
import { getProvider, getDefaultProvider } from "./providers/provider";

export function createBrandImg(
	doc: Document,
	token: BrandToken,
	settings: BrandIconSettings
): HTMLImageElement {
	const provider = getProvider(settings.provider) ?? getDefaultProvider();
	const variant = token.variant ?? settings.defaultVariant;
	const size = token.size ?? settings.defaultSize;
	const url = provider.buildUrl(
		token.domain,
		variant,
		size,
		settings.providerConfig
	);

	const img = doc.createElement("img");
	img.src = url;
	img.alt = `${token.domain} ${variant}`;
	img.classList.add("brand-icons-inline");
	if (token.size) {
		img.style.height = `${size}px`;
	}
	return img;
}
