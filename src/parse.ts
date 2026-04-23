export interface BrandToken {
	domain: string;
	variant?: string;
	size?: number;
}

const BRAND_PATTERN =
	/:brand:([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\|([a-z]+))?(?:\|(\d+))?:/g;

export function findBrandSpans(
	text: string
): { from: number; to: number; token: BrandToken }[] {
	const spans: { from: number; to: number; token: BrandToken }[] = [];
	let match: RegExpExecArray | null;

	BRAND_PATTERN.lastIndex = 0;
	while ((match = BRAND_PATTERN.exec(text)) !== null) {
		const token: BrandToken = { domain: match[1] };
		if (match[2]) {
			token.variant = match[2];
		}
		if (match[3]) {
			token.size = parseInt(match[3], 10);
		}
		spans.push({
			from: match.index,
			to: match.index + match[0].length,
			token,
		});
	}
	return spans;
}
