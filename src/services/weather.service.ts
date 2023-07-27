import axios from "axios";
import { Observable, Subject, shareReplay, switchMap, timer } from "rxjs";
import { WeatherParams } from "src/interfaces/weatherParams.interface";

export class WeatherService {
	private trigger$ = new Subject<WeatherParams>();
	private weather$: Observable<any>;

	constructor() {
		this.weather$ = this.trigger$.pipe(
			switchMap((params) => this.getWeatherData(params)),
			shareReplay(1)
		);
	}

	private async getWeatherData(params: WeatherParams) {
		const response = await axios.get(
			this.setWeatherURLFormat(params.city, params.format)
		);

		return response.data;
	}

	public refresh(params: WeatherParams) {
		this.trigger$.next(params);
	}

	public autoRefresh(params: WeatherParams, delay: number, interval: number) {
		timer(delay, interval).subscribe(() => this.refresh(params));
	}

	public subscribe(observer: (value: any) => void) {
		this.weather$.subscribe(observer);
	}

	private setWeatherURLFormat(city?: string, format?: string) {
		var url = `https://wttr.in/`;

		if (city) {
			url = `https://wttr.in/${city}`;
		}

		if (format) {
			url += `?format="${format}"`;
		}

		console.log(url);

		return url;
	}
}
