export interface ProviderSettingField {
  key: string
  name: string
  description: string
  placeholder?: string
}

export interface BrandProvider {
  readonly id: string
  readonly name: string
  readonly supportedVariants: readonly string[]
  readonly defaultVariant: string
  readonly settingsFields: readonly ProviderSettingField[]
  buildUrl(
    domain: string,
    variant: string,
    size: number,
    config: Record<string, string>,
  ): string
}

export const providers: BrandProvider[] = []

export function getProvider(id: string): BrandProvider | undefined {
  return providers.find((p) => p.id === id)
}

export function getDefaultProvider(): BrandProvider {
  return providers[0]
}
