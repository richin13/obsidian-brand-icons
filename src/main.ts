import { Plugin } from "obsidian";
import "./providers/brandfetch";
import {
	BrandIconSettingTab,
	DEFAULT_SETTINGS,
	type BrandIconSettings,
} from "./settings";
import { brandIconPostProcessor } from "./post-processor";
import { brandIconExtension } from "./editor-extension";

export default class BrandIconPlugin extends Plugin {
	settings: BrandIconSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerMarkdownPostProcessor(
			brandIconPostProcessor(this.settings)
		);
		this.registerEditorExtension(brandIconExtension(this));

		this.addSettingTab(new BrandIconSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
