'use strict';

const moonPhases = {
	'new': 'Lua nova',
	'waxing_crescent': 'Lua crescente',
	'first_quarter': 'Quarto crescente',
	'waxing_gibbous': 'Gibosa crescente',
	'full': 'Lua cheia',
	'waning_gibbous': 'Gibosa minguante',
	'last_quarter': 'Quarto minguante',
	'waning_crescent': 'Lua minguante'
};
const daysOfWeek = {
	'Dom': 'Domingo',
	'Seg': 'Segunda',
	'Ter': 'Terça',
	'Qua': 'Quarta',
	'Qui': 'Quinta',
	'Sex': 'Sexta',
	'Sáb': 'Sábado',
};
const currentDiv = document.getElementById('current');
const forecastDiv = document.getElementById('forecast');
const conditionSlugImg = document.getElementById('condition-slug');
const cache = location.pathname + location.search;
const standardPressureAtSeaLevel = 1013.25;
const urlParams = new URLSearchParams(location.search);
const woeid = urlParams.get('woeid');
const apiFormat = 'json-cors';
const apiKey = '38c0fb37';
const apiUrl = new URL('https://api.hgbrasil.com/weather');

function secondsBetween(initialDate, finalDate) {
	const deltaInMiliseconds = (finalDate - initialDate);
	const deltaInSeconds = (deltaInMiliseconds / 1000);
	return deltaInSeconds;
}

function minutesBetween(initialDate, finalDate) {
	const deltaInSeconds = secondsBetween(initialDate, finalDate);
	const deltaInMinutes = (deltaInSeconds / 60);
	return deltaInMinutes;
}

function to24HourFormat(timeString) {
	const [time, period] = timeString.split(' ');
	const [hour, minute] = time.split(':');
	let formattedHour = (period === 'pm') ? (parseInt(hour) + 12) : hour;
	return `${formattedHour}:${minute}`;
}

function cacheIsValid() {
	const dataString = localStorage.getItem(cache);
	if (dataString === null) {
		console.log('Sem cachê!');
		return false;
	}
	console.log('Cachê existe.');
	const data = JSON.parse(dataString);
	const [lastSyncDay, lastSyncMonth, lastSyncYear] = (data.results.date).split('/');
	const [lastSyncHour, lastSyncMinute] = (data.results.time).split(':');
	const lastSyncDate = new Date(lastSyncYear, (lastSyncMonth - 1), lastSyncDay, lastSyncHour, lastSyncMinute);
	const lastRequestDate = new Date(data.got_at);
	const now = new Date();
	const minutesSinceLastSync = (minutesBetween(lastSyncDate, now));
	const minutesSinceLastRequest = (minutesBetween(lastRequestDate, now));
	const isTooEarly = (minutesSinceLastSync < 60) || (minutesSinceLastRequest < 10);
	console.log('Dados recebidos há', Math.floor(minutesSinceLastRequest), 'minutos.');
	console.log('Dados atualizados há', Math.floor(minutesSinceLastSync), 'minutos.');
	isTooEarly ? console.log('Ainda é cedo, amor, como diria Cartola.') : console.log('É tarde demais, como diria Raça Negra.');
	return isTooEarly;
}

async function getData(url) {
	console.log('Requisitando dados...');
	const response = await fetch(url);
	console.log('Dados recebidos.');
	const data = response.json();
	return data;
}

async function showData() {
	try {
		let data;
		console.log('Cachê é válido?');
		if (cacheIsValid()) {
			console.log('Cachê é válido.');
			const dataString = localStorage.getItem(cache);
			data = JSON.parse(dataString);
		} else {
			console.log('Cachê não é válido.');
			apiUrl.searchParams.set('format', apiFormat);
			apiUrl.searchParams.set('key', apiKey);
			woeid ? apiUrl.searchParams.set('woeid', woeid) : apiUrl.searchParams.set('user_ip', 'remote');
			data = await getData(apiUrl);
			data.got_at = new Date();
			const dataToCache = JSON.stringify(data);
			console.log('Salvando cachê...');
			localStorage.setItem(cache, dataToCache);
			console.log('Cachê salvo.');
		}
		const currentData = data.results;
		const feelsLike = Math.round(apparentTemperature(
			Number(currentData.temp),
			Number(currentData.wind_speedy),
			Number(currentData.humidity),
			standardPressureAtSeaLevel
		));
		const currentDataArray = [
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: currentData.city},
			{'class': 'text-nowrap text-xs font-semibold mt-1 text-gray-400', data: `${currentData.date} ${currentData.time}`},
			{'class': 'text-nowrap text-6xl font-bold', data: `${currentData.temp}°C`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Sensação: ${feelsLike}°C ${((feelsLike > 17) && (feelsLike < 27)) ? '🙂' : '😣'}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• ${currentData.description}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Umidade: ${currentData.humidity}%`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Nebulosidade: ${currentData.cloudiness}%`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Chuva na última 1h: ${currentData.rain}mm`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Amanhecer: ${to24HourFormat(currentData.sunrise)}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Anoitecer: ${to24HourFormat(currentData.sunset)}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• ${moonPhases[currentData.moon_phase]}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Vento: ${currentData.wind_speedy} ${currentData.wind_direction}° ${currentData.wind_cardinal}`}
		];
		currentDataArray.forEach((element) => {
			const span = document.createElement('span');
			span.className = element.class;
			span.innerText = element.data;
			currentDiv.appendChild(span);
		});
		conditionSlugImg.setAttribute('src', `https://assets.hgbrasil.com/weather/icons/conditions/${currentData.condition_slug}.svg`);
		conditionSlugImg.setAttribute('alt', currentData.description);
		const forecastData = data.results.forecast;
		forecastData.forEach((element) => {					
			const forecastDataArray = [
				{'class': 'text-nowrap text-base font-bold', data: `${daysOfWeek[element.weekday]}, ${element.date}:`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• ${element.description}`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Mínima: ${element.min}°C`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Máxima: ${element.max}°C`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Nebulosidade: ${element.cloudiness}%`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Chuva esperada: ${element.rain}mm`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Chances de chuva: ${element.rain_probability}%`},
				{'class': 'text-nowrap font-semibold mt-1 text-gray-500', data: `• Vento: ${element.wind_speedy}`}
			];
			const columnsDiv = document.createElement('div');
			columnsDiv.classList.add('flex');
			columnsDiv.classList.add('justify-between');
			const textColumnDiv = document.createElement('div');
			textColumnDiv.classList.add('flex');
			textColumnDiv.classList.add('flex-col');
			const imageColumnDiv = document.createElement('div');
			imageColumnDiv.classList.add('flex');
			imageColumnDiv.classList.add('flex-col');
			const imageSpan = document.createElement('span');
			imageSpan.classList.add('mt-1');
			const imgTag = document.createElement('img');
			imgTag.setAttribute('src', `https://assets.hgbrasil.com/weather/icons/conditions/${element.condition}.svg`);
			imgTag.setAttribute('width', '176');
			imgTag.setAttribute('height', '176');
			imgTag.setAttribute('alt', element.description);
			forecastDiv.appendChild(columnsDiv);
			columnsDiv.appendChild(textColumnDiv);
			forecastDataArray.forEach((element) => {
				const span = document.createElement('span');
				span.className = element.class;
				span.innerText = element.data;
				textColumnDiv.appendChild(span);
			});
			columnsDiv.appendChild(imageColumnDiv);
			imageColumnDiv.appendChild(imageSpan);
			imageSpan.appendChild(imgTag);
		});
	} catch (error) {
		console.error('Error!', error.message);
	}
}

showData();