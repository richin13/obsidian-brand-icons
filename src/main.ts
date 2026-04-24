import { Plugin } from "obsidian"
import "./providers/brandfetch"
import { brandIconExtension } from "./editor-extension"
import { brandIconPostProcessor } from "./post-processor"
import {
  type BrandIconSettings,
  BrandIconSettingTab,
  DEFAULT_SETTINGS,
} from "./settings"

export default class BrandIconPlugin extends Plugin {
  settings: BrandIconSettings = DEFAULT_SETTINGS

  async onload(): Promise<void> {
    await this.loadSettings()

    this.registerMarkdownPostProcessor(brandIconPostProcessor(this.settings))
    this.registerEditorExtension(brandIconExtension(this))

    this.addSettingTab(new BrandIconSettingTab(this.app, this))
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
  }
}
