/**
 * Author: DaniS1448 (https://github.com/DaniS1448)
 * 
 * Sets the default values for the construction page and updates the page content
 * based on the user's location and language.
 * 
 * @constant {string} defaultCountry - The default country code.
 * @constant {string} defaultLanguage - The default language code.
 * @constant {string} defaultTitle - The default title for the page.
 * @constant {string} defaultMessage - The default message for the page.
 * @constant {string} defaultCopyright - The default copyright message.
 * @constant {number} currentYear - The current year.
 * @constant {number} numStars - The number of stars to display in the background.
 * 
 * @event DOMContentLoaded - Event triggered when the DOM is fully loaded.
 */

/**
 * Fetches the user's location and language, and updates the page content accordingly.
 * If the user's country matches the default country, the default values are used.
 * Otherwise, the content is translated to the user's language throw Google Translate API.
 * 
 * @async
 * @function getLocationAndSetTexts
 * @returns {Promise<void>} - A promise that resolves when the content is updated.
 */

const defaultCountry = "ES"; // US
const defaultLanguage = "es"; // en
const defaultTitle = "Bajo construcción"; // Under construction
const defaultMessage = "Grandes cosas están por llegar"; // Great things are yet to come
const defaultCopyright = "Todos los derechos reservados"; // All rights reserved
const currentYear = new Date().getFullYear();
const numStars = 500;

document.addEventListener("DOMContentLoaded", function () {
	createStars();
	getLocationAndSetTexts();
});

async function getLocationAndSetTexts() {
	document.querySelector(".title").textContent = window.location.hostname;
	const subTitle = document.querySelector(".sub-title");
	const copyright = document.querySelector('.copyright');
	try {
		const response = await fetch("https://ipapi.co/json/");
		const data = await response.json();
		const country = data.country;
		const language = data.languages?.split(",")[0] || "en";
		if (country === defaultCountry) {
			document.title = defaultTitle;
			subTitle.textContent = defaultMessage;
			copyright.textContent = `© ${currentYear} ${window.location.hostname}. ${defaultCopyright}.`;
		} else {
			const textsToTranslate = `${defaultMessage}\n${defaultTitle}\n${defaultCopyright}`;
			const translateResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${defaultLanguage}&tl=${language}&dt=t&q=${encodeURIComponent(textsToTranslate)}`);
			const translation = await translateResponse.json();
			subTitle.textContent = translation[0][0][0];
			document.title = translation[0][1][0];
			copyright.textContent = `© ${currentYear} ${window.location.hostname}. ${translation[0][2][0]}.`;
		}
	} catch (error) {
		console.error("Error:", error);
		subTitle.textContent = defaultMessage;
		document.title = defaultTitle;
		copyright.textContent = `© ${currentYear} ${window.location.hostname}. ${defaultCopyright}`;
	}
}

function createStars(){
	const starsContainer = document.getElementById('stars');

	for (let i = 0; i < numStars; i++) {
		const star = document.createElement('div');
		star.classList.add('star');
		star.style.top = `${Math.random() * 150}%`;
		star.style.left = `${Math.random() * 100}%`;
		const size = Math.random() * 1.5 + 1;
		star.style.width = `${size}px`;
		star.style.height = `${size}px`;
		star.style.background = '#fff';
		star.style.animation = `moveUp ${Math.random() * 30 + 10}s linear infinite`;
		starsContainer.appendChild(star);

		// Reset the position of the star when it reaches the top of the page
		star.addEventListener('animationiteration', () => {
			star.style.top = '100%';
			star.style.left = `${Math.random() * 100}%`;
		});
	}
}
