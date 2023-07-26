import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import { getWeatherDataOnTimer, getWeatherData } from "src/get-weather-data";

// Remember to rename these classes and interfaces!

interface FetchWeatherPluginSettings {
	city: string;
}

const DEFAULT_SETTINGS: FetchWeatherPluginSettings = {
	city: "London",
};

export default class FetchWeatherPlugin extends Plugin {
	settings: FetchWeatherPluginSettings;
	currentWeather: string;
	fullWeather: string;
	statusBarItemEl = this.addStatusBarItem();

	async onload() {
		await this.loadSettings();

		const weatherObserver = {
			next: (value: any) => this.setWeatherToStatusBar(value),
			error: (error: any) => this.setErrorNotice(error),
			complete: () => console.log("done"),
		};

		getWeatherDataOnTimer(this.settings.city, "+%c+%t").subscribe(
			weatherObserver
		);

		getWeatherData(this.settings.city).subscribe((value: any) => {
			this.fullWeather = value;
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "insert-weather",
			name: "Insert Weather",
			editorCallback: (editor: Editor) => {
				editor.replaceRange(this.fullWeather, editor.getCursor());
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	setWeatherToStatusBar(weather: string) {
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl.setText(weather);
		this.currentWeather = weather;
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
