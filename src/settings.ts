import { type App, PluginSettingTab, Setting } from "obsidian"
import type BrandIconPlugin from "./main"
import {
  getDefaultProvider,
  getProvider,
  providers,
} from "./providers/provider"

export interface BrandIconSettings {
  provider: string
  defaultSize: number
  defaultVariant: string
  providerConfig: Record<string, string>
}

export const DEFAULT_SETTINGS: BrandIconSettings = {
  provider: "brandfetch",
  defaultSize: 20,
  defaultVariant: "icon",
  providerConfig: {},
}

export class BrandIconSettingTab extends PluginSettingTab {
  plugin: BrandIconPlugin

  constructor(app: App, plugin: BrandIconPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()

    const activeProvider =
      getProvider(this.plugin.settings.provider) ?? getDefaultProvider()

    new Setting(containerEl)
      .setName("Provider")
      .setDesc("Which brand icon service to use.")
      .addDropdown((dropdown) => {
        for (const p of providers) {
          dropdown.addOption(p.id, p.name)
        }
        dropdown.setValue(activeProvider.id).onChange(async (value) => {
          this.plugin.settings.provider = value
          const newProvider = getProvider(value) ?? getDefaultProvider()
          this.plugin.settings.defaultVariant = newProvider.defaultVariant
          await this.plugin.saveSettings()
          this.display()
        })
      })

    new Setting(containerEl)
      .setName("Default size")
      .setDesc("Default icon height in pixels.")
      .addText((text) =>
        text
          .setPlaceholder("20")
          .setValue(String(this.plugin.settings.defaultSize))
          .onChange(async (value) => {
            const parsed = parseInt(value, 10)
            if (!Number.isNaN(parsed) && parsed > 0) {
              this.plugin.settings.defaultSize = parsed
              await this.plugin.saveSettings()
            }
          }),
      )

    if (activeProvider.supportedVariants.length > 1) {
      new Setting(containerEl)
        .setName("Default variant")
        .setDesc("Which logo variant to use by default.")
        .addDropdown((dropdown) => {
          for (const v of activeProvider.supportedVariants) {
            dropdown.addOption(v, v.charAt(0).toUpperCase() + v.slice(1))
          }
          dropdown
            .setValue(this.plugin.settings.defaultVariant)
            .onChange(async (value) => {
              this.plugin.settings.defaultVariant = value
              await this.plugin.saveSettings()
            })
        })
    }

    for (const field of activeProvider.settingsFields) {
      const configKey = `${activeProvider.id}.${field.key}`
      new Setting(containerEl)
        .setName(field.name)
        .setDesc(field.description)
        .addText((text) => {
          text
            .setPlaceholder(field.placeholder ?? "")
            .setValue(this.plugin.settings.providerConfig[configKey] ?? "")
            .onChange(async (value) => {
              this.plugin.settings.providerConfig[configKey] = value
              await this.plugin.saveSettings()
            })
        })
    }
  }
}
