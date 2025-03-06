let adjectives = [];
let sortDirection = "up";

async function init() {
	// Haal de data van de API
	await fetchAdjectives();
	addSortEvents();
	addVoteEvents();
	render();

	// Haal elke 10 seconden de data opnieuw op
	setInterval(fetchAdjectives, 10000);
}

async function fetchAdjectives() {
	try {
		const response = await fetch("https://dev2-prima.onrender.com/adjectives");
		const data = await response.json();
		adjectives = data;
		sort();
		render();
	} catch (error) {
		console.error("Fout bij het ophalen van adjectieven:", error);
	}
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

async function upVote(value) {
	// Upvote via de API
	await updateVote(value, "upvote");
	render();
}

async function downVote(value) {
	// Downvote via de API
	await updateVote(value, "downvote");
	render();
}

async function updateVote(word, voteType) {
	const response = await fetch(`https://dev2-prima.onrender.com/${voteType}/${word}`, {
		method: "GET",
	});

	// We hoeven hier geen score bij te houden omdat de API het voor ons regelt
	const data = await response.json();

	// Bijwerken van de lokale data na de update van de API
	fetchAdjectives();
}

init(); // Roep init aan om het proces te starten
