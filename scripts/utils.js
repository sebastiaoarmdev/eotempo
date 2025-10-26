// /scripts/utils.js

'use strict';

/**
 * Converte um tempo de 12 horas (ex: "5:00 pm") para 24 horas (ex: "17:00").
 * @param {string} timeString - A string de tempo no formato "HH:MM am/pm".
 * @returns {string} O tempo no formato "HH:MM".
 */
export function to24HourFormat(timeString) {
	const [time, period] = timeString.split(' ');
	const [hour, minute] = time.split(':');
	let formattedHour = (period === 'pm') ? (parseInt(hour) + 12) : hour;
	return `${formattedHour}:${minute}`;
}

/**
 * Calcula a diferença em segundos entre duas datas.
 * @param {Date} initialDate
 * @param {Date} finalDate
 * @returns {number} A diferença em segundos.
 */
export function secondsBetween(initialDate, finalDate) {
	const deltaInMiliseconds = (finalDate - initialDate);
	const deltaInSeconds = (deltaInMiliseconds / 1000);
	return deltaInSeconds;
}

/**
 * Calcula a diferença em minutos entre duas datas.
 * @param {Date} initialDate
 * @param {Date} finalDate
 * @returns {number} A diferença em minutos.
 */
export function minutesBetween(initialDate, finalDate) {
	const deltaInSeconds = secondsBetween(initialDate, finalDate);
	const deltaInMinutes = (deltaInSeconds / 60);
	return deltaInMinutes;
}
