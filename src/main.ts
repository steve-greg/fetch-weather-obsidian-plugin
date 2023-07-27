import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";

import { WeatherService } from "src/services/weather.service";
import { WeatherSettings } from "./interfaces/settings.interface";
import { WeatherParams } from "./interfaces/weatherParams.interface";

const DEFAULT_SETTINGS: WeatherSettings = {
	city: "London",
};

export default class FetchWeatherPlugin extends Plugin {
	settings: WeatherSettings;
	weatherService$: any;
	weatherText: string;
	statusBarItemEl = this.addStatusBarItem();

	async onload() {
		await this.loadSettings();

		// Create a new instance of the weather service
		this.weatherService$ = new WeatherService();

		// Set the weather params
		const weatherParams: WeatherParams = {
			city: this.settings.city,
			format: "+%c+%t",
		};

		// Set up the subscription to the weather service
		// This block will fire when refresh() is called
		// Or when autoRefresh() timer fires
		this.weatherService$.subscribe(this.setWeatherToStatusBar.bind(this));

		// Update the weather on a timer
		this.weatherService$.autoRefresh(weatherParams, 0, 150000);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherSettingTab(this.app, this));
	}

	onunload() {}

	setWeatherToStatusBar(weather: string) {
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl.setText(weather);
		this.weatherText = weather;
	}

	setErrorNotice(error: string) {
		new Notice(error);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class WeatherSettingTab extends PluginSettingTab {
	plugin: FetchWeatherPlugin;

	constructor(app: App, plugin: FetchWeatherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("City")
			.setDesc("Enter your city name")
			.addText((text) =>
				text
					.setPlaceholder("Los Angeles")
					.setValue(this.plugin.settings.city)
					.onChange(async (value) => {
						this.plugin.settings.city = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
