// /scripts/main.js

'use strict';

import { getWeatherData } from './api.js';
import { renderCurrentWeather, renderForecast } from './dom.js';

async function showData() {
	try {
		const urlParams = new URLSearchParams(location.search);
		const woeid = urlParams.get('woeid');

		const data = await getWeatherData(woeid);
		
		const currentData = data.results;
		const forecastData = data.results.forecast;
        
		// 1. Renderiza o tempo atual
		renderCurrentWeather(currentData); 

		// 2. Renderiza a previsão
		renderForecast(forecastData);

	} catch (error) {
		console.error('Error!', error.message);
	}
}

showData();
