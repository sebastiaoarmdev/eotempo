// /scripts/cache.js

import { minutesBetween } from './utils.js';

const cacheKey = location.pathname + location.search;

/**
 * Verifica se o cache é válido e retorna os dados se for.
 * @returns {{ data: any, isValid: boolean }} Um objeto com os dados (se existirem) e um booleano de validade.
 */
export function getCachedData() {
	const dataString = localStorage.getItem(cacheKey);
	if (dataString === null) {
		console.log('Cache não existe!');
		return { data: null, isValid: false };
	}
	
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
	
	// Retornamos o objeto já parseado para evitar o parsing duplicado no main.js
	return { data: data, isValid: isTooEarly }; 
}

/**
 * Salva os dados no cache.
 * @param {any} data - O objeto de dados para salvar.
 */
export function saveToCache(data) {
	data.got_at = new Date(); // Garante que a data da requisição esteja no objeto
	const dataToCache = JSON.stringify(data);
	console.log('Salvando cache...');
	localStorage.setItem(cacheKey, dataToCache);
	console.log('Cache salvo.');
}
