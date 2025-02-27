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
