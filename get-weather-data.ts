import axios, { AxiosResponse } from "axios";
import { Notice } from "obsidian";
import { from, shareReplay, switchMap, tap, timer } from "rxjs";

const delay = 0;
const interval = 300000;

export function getWeatherDataOnTimer(city?: string | null, format?: string) {
	var url = `https://wttr.in/`;
	if (city) {
		url = `https://wttr.in/${city}`;
	}
	if (format) {
		url += `?format="${format}"`;
	}
	return timer(delay, interval).pipe(
		switchMap(() => from(axios.get(url))),
		switchMap((response: AxiosResponse) => {
			if (response.status !== 200) {
				new Notice("Error fetching weather data");
				return [];
			}
			return [response.data];
		}),
		shareReplay(1)
	);
}

export function getWeatherData(city: string) {
	var url = `https://wttr.in/${city}?format=3`;
	var promise = axios.get(url).then((response: AxiosResponse) => {
		if (response.status !== 200) {
			new Notice("Error fetching weather data");
			return [];
		}
		return response.data;
	});

	return from(promise);
}
