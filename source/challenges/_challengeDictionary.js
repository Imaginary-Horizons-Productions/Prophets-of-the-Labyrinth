const { ChallengeTemplate, Adventure } = require("../classes");

/** @type {Record<string, ChallengeTemplate>} */
const CHALLENGES = {};
const STARTING_CHALLENGES = [];
const ROLLABLE_CHALLENGES = [];

for (const file of [
	"cantholdallthisvalue.js",
	"intothedeepend.js",
	"restless.js",
	"rushing.js",
	"shoddycraftsmanship.js",
	"trainingweights.js",
	"unlabelledplacebos.js"
]) {
	/** @type {ChallengeTemplate} */
	const challenge = require(`./${file}`);
	CHALLENGES[challenge.name] = challenge;
	if (challenge.startingChallenge) {
		STARTING_CHALLENGES.push(challenge.name);
	}
	if (challenge.rollableChallenge) {
		ROLLABLE_CHALLENGES.push(challenge.name);
	}
}

function getStartingChallenges() {
	return STARTING_CHALLENGES;
}

/** @param {string} challengeName */
function getChallenge(challengeName) {
	return CHALLENGES[challengeName];
}

/**
 * @param {number} rolls
 * @param {Adventure} adventure
 */
function rollChallenges(rolls, adventure) {
	const challenges = [];
	for (let i = 0; i < rolls; i++) {
		const rolledChallenge = ROLLABLE_CHALLENGES[adventure.generateRandomNumber(ROLLABLE_CHALLENGES.length, "general")];
		if (!challenges.includes(rolledChallenge)) {
			challenges.push(rolledChallenge);
		}
	}
	return challenges;
}

module.exports = {
	getStartingChallenges,
	getChallenge,
	rollChallenges
};
