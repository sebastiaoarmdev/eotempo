// /scripts/dom.js

import { to24HourFormat } from './utils.js';

import { apparentTemperature } from './weather.js';

const standardPressureAtSeaLevel = 1013.25;

const moonPhases = {
	'new': 'Lua nova 🌚',
	'waxing_crescent': 'Lua crescente 🌒',
	'first_quarter': 'Quarto crescente 🌓',
	'waxing_gibbous': 'Gibosa crescente 🌔',
	'full': 'Lua cheia 🌕',
	'waning_gibbous': 'Gibosa minguante 🌖',
	'last_quarter': 'Quarto minguante 🌗',
	'waning_crescent': 'Lua minguante 🌘',
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

/**
 * Renderiza os dados atuais de tempo.
 * @param {object} currentData - Os dados atuais.
 */
export function renderCurrentWeather(currentData) {
	const currentDiv = document.getElementById('current');
	const conditionSlugImg = document.getElementById('condition-slug');
	const h1 = document.querySelector('h1');

    
    // Limpa o conteúdo anterior
    currentDiv.innerHTML = ''; 

	const feelsLike = Math.round(apparentTemperature(
		Number(currentData.temp),
		Number(currentData.wind_speedy),
		Number(currentData.humidity) / 100, 
		standardPressureAtSeaLevel
	));
    
    // **Melhoria de UX/A11y/SEO:** Título dinâmico
    document.title = `O Tempo em ${currentData.city}`;

	h1.innerText = `${currentData.city}?`;

	const currentDataArray = [
		{'class': 'text-nowrap text-xs font-semibold mt-1 text-gray-400', data: `${currentData.date} ${currentData.time}`},
		{'class': 'text-nowrap text-3xl font-bold', 'data': `${currentData.temp}°C`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Sensação: ${feelsLike}°C ${((feelsLike > 16) && (feelsLike < 28)) ? '🙂' : '😣'}`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• ${currentData.description}`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Umidade: ${currentData.humidity}%`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Nebulosidade: ${currentData.cloudiness}%`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Chuva na última 1h: ${currentData.rain}mm`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Amanhecer: ${to24HourFormat(currentData.sunrise)}`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Anoitecer: ${to24HourFormat(currentData.sunset)}`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• ${moonPhases[currentData.moon_phase]}`},
		{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Vento: ${currentData.wind_speedy} ${currentData.wind_direction}° ${currentData.wind_cardinal}`}
	];
    
    // Otimização de Performance: 
    // Usar DocumentFragment para reduzir o número de manipulações diretas no DOM
    const fragment = document.createDocumentFragment();

	currentDataArray.forEach((element) => {
		const span = document.createElement('span');
		span.className = element.class;
		span.innerText = element.data;
		fragment.appendChild(span);
	});
    
    currentDiv.appendChild(fragment); // Adiciona tudo de uma vez
    
	conditionSlugImg.setAttribute('src', `https://assets.hgbrasil.com/weather/icons/conditions/${currentData.condition_slug}.svg`);
	conditionSlugImg.setAttribute('alt', currentData.description);
}

/**
 * Função auxiliar para aplicar múltiplas classes de uma vez.
 * Ajuda a reduzir a repetição de classList.add().
 * @param {HTMLElement} element
 * @param {string} classesString
 */
function applyClasses(element, classesString) {
    element.className = classesString;
}


/**
 * Renderiza a previsão do tempo.
 * @param {array} forecastData - A array de previsão.
 */
export function renderForecast(forecastData) {
	const forecastDiv = document.getElementById('forecast');
    
    // Limpa o conteúdo anterior
    const content = forecastDiv.querySelectorAll(':scope > *:not(h2):not(hr)');
    content.forEach(el => el.remove());

    const fragment = document.createDocumentFragment();
    
	forecastData.forEach((element) => {					
		const forecastDataArray = [
			{'class': 'text-nowrap text-xl text-base font-bold', 'data': `${daysOfWeek[element.weekday]}, ${element.date}:`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• ${element.description}`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Mínima: ${element.min}°C`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Máxima: ${element.max}°C`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Nebulosidade: ${element.cloudiness}%`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Chuva esperada: ${element.rain}mm`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Chances de chuva: ${element.rain_probability}%`},
			{'class': 'text-nowrap font-semibold mt-1 text-gray-500', 'data': `• Vento: ${element.wind_speedy}`}
		];
        
        // **Clareza e DRY:** Definindo as classes de uma vez
		const columnsDiv = document.createElement('div');
		applyClasses(columnsDiv, 'flex justify-between p-4 mb-4 border-b border-gray-200'); // Adicionando padding/margin para melhor separação visual (UX)
        
		const textColumnDiv = document.createElement('div');
		applyClasses(textColumnDiv, 'flex flex-col flex-grow'); // flex-grow para usar espaço disponível
        
		const imageColumnDiv = document.createElement('div');
		applyClasses(imageColumnDiv, 'flex flex-col items-end flex-shrink-0'); // flex-shrink-0 para manter o tamanho da imagem

		const imageSpan = document.createElement('span');
		applyClasses(imageSpan, 'mt-1'); 
        
		const imgTag = document.createElement('img');
		imgTag.setAttribute('src', `https://assets.hgbrasil.com/weather/icons/conditions/${element.condition}.svg`);
		imgTag.setAttribute('width', '128');
		imgTag.setAttribute('height', '128');
        // **Acessibilidade (A11y):** Garantir o alt
		imgTag.setAttribute('alt', `Ícone da previsão: ${element.description}`); 
        
        // Montagem do card da previsão
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
        
        fragment.appendChild(columnsDiv);
	});
    
    forecastDiv.appendChild(fragment); 
}
