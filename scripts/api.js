// /scripts/api.js

import { getCachedData, saveToCache } from './cache.js';

const apiFormat = 'json-cors';
const apiKey = '38c0fb37';
const apiUrlBase = 'https://api.hgbrasil.com/weather';

/**
 * Faz a requisição à API.
 * @param {string | null} woeid - O WOEID da cidade ou null para IP remoto.
 * @returns {Promise<any>} Os dados da API.
 */
async function fetchData(woeid) {
	const apiUrl = new URL(apiUrlBase);
	apiUrl.searchParams.set('format', apiFormat);
	apiUrl.searchParams.set('key', apiKey);
	woeid ? apiUrl.searchParams.set('woeid', woeid) : apiUrl.searchParams.set('user_ip', 'remote');

	console.log('Requisitando dados...');
	const response = await fetch(apiUrl);
	console.log('Dados recebidos.');
	const data = response.json();
	return data;
}

/**
 * Obtém os dados de tempo, usando cache ou fazendo nova requisição.
 * @param {string | null} woeid - O WOEID da cidade ou null para IP remoto.
 * @returns {Promise<any>} Os dados de tempo.
 */
export async function getWeatherData(woeid) {
	const { data, isValid } = getCachedData();

	if (isValid) {
		console.log('Usando cache válido.');
		return data;
	} else {
		console.log('Cache não é válido. Buscando novos dados.');
		const newData = await fetchData(woeid);
		saveToCache(newData);
		return newData;
	}
}
