//Vandaag gaan we de oefening van vorige week 'De schaal van prima' herwerken zodat deze een API gebruikt.

// Het belangrijkste voordeel hiervan is dat het gebruik maakt van gecentraliseerde data. Elke student bouwt hun eigen front-end voor dezelfde API. Als de data door een van deze front-ends wordt aangepast, zullen de nieuwe gewijzigde gegevens ook zichtbaar zijn voor de andere studenten.

// Stap 1: Verken de API
// Navigeer naar de API en verken de verschillende endpoints.

// api stuff:
// [GET /adjectives] all adjectives
// Get a list of all adjectives

// url:
// https://dev2-prima.onrender.com/adjectives
// [GET /upvote/WORD] upvote an adjective
// url:
// https://dev2-prima.onrender.com/upvote/WORD
// example:
// https://dev2-prima.onrender.com/upvote/ok
// [GET /downvote/WORD] downvote an adjective
// url:
// https://dev2-prima.onrender.com/downvote/WORD
// example:
// https://dev2-prima.onrender.com/downvote/ok

// https://dev2-prima.onrender.com/Links to an external site.

// Wat zijn de beschikbare endpoints? Hoe moeten ze worden gebruikt? Welke soorten antwoorden krijg je voor elk endpoint? Hoe is de data in het antwoord gestructureerd?

// Stap 2: Maak een to-do lijst
// Begin met het maken van een back-up van de code van vorige week.
// Maak een bestand main_backup.js en kopieer je bestaande code daarin.

// Vorige week hebben we in de klas een stapsgewijs plan gemaakt om de oefening op te lossen, nu doe je dit zelf in groep (per tafel). Noteer de verschillende stappen als opmerkingen in je code.

// Stap 3: Implementeren
// De vereisten voor de oefening zijn hetzelfde als vorige week, maar deze week gebruiken we geen lokale data meer, maar alleen data die van een API komt.

// Toon de verschillende woorden en hun scores
// Gebruik de data van de API
// Zorg ervoor dat ze altijd gesorteerd zijn, de gebruiker kan kiezen tussen 2 manieren van sorteren
// De gebruiker kan een woord up- en downvoten
// Gebruik de opgegeven API-endpoints hiervoor
// De scores voor elk woord kunnen in de loop van de tijd veranderen, zorg ervoor dat de adjectieven elke 10 seconden worden opgehaald.

//

//

import { getAdjectives } from "./data.js";
let adjectives = [];
let sortDirection = "up";

function init() {
	// Haal de data op en zet deze om naar een object
	const data = JSON.parse(getAdjectives());
	adjectives = data;

	addSortEvents();
	addVoteEvents();
	render();
}

function addSortEvents() {
	const sortUpButton = document.getElementById("sort-up");
	const sortDownButton = document.getElementById("sort-down");

	sortUpButton.addEventListener("click", function () {
		sortDirection = "up";
		sort();
		render();
	});

	sortDownButton.addEventListener("click", function () {
		sortDirection = "down";
		sort();
		render();
	});
}

function addVoteEvents() {
	const upvoteButtons = document.querySelectorAll(".upvote-button");
	const downvoteButtons = document.querySelectorAll(".downvote-button");

	upvoteButtons.forEach((button) => {
		button.addEventListener("click", function () {
			upVote(button.value);
		});
	});

	downvoteButtons.forEach((button) => {
		button.addEventListener("click", function () {
			downVote(button.value);
		});
	});
}

function sort() {
	adjectives.sort(function (a, b) {
		return sortDirection === "up" ? a.score - b.score : b.score - a.score;
	});
}

function render() {
	const container = document.getElementById("container");
	container.innerHTML = ""; // Leeg de container voordat je nieuwe items toevoegt

	adjectives.forEach((item) => {
		const wordItem = document.createElement("div");
		wordItem.classList.add("word-item");

		const scoreClass = item.score >= 6 ? "good" : "bad";
		wordItem.innerHTML = `
            <span class="word-score ${scoreClass}">${item.score}</span>
            <span>${item.word}</span>
            <div class="vote-buttons">
                <button value="${item.word}" class="upvote-button">👍</button>
                <button value="${item.word}" class="downvote-button">👎</button>
            </div>
        `;

		container.appendChild(wordItem);
	});

	addVoteEvents(); // Voeg stem-event listeners opnieuw toe na het renderen
}

function upVote(value) {
	updateScore(value, 0.1);
	render();
}

function downVote(value) {
	updateScore(value, -0.1);
	render();
}

function updateScore(word, scoreChange) {
	const foundIndex = adjectives.findIndex((item) => item.word === word);
	if (foundIndex !== -1) {
		adjectives[foundIndex].score += scoreChange;
		adjectives[foundIndex].score = Math.round(adjectives[foundIndex].score * 10) / 10; // Rond af op 1 decimaal
	}
}

init(); // Roep init aan om het proces te starten
