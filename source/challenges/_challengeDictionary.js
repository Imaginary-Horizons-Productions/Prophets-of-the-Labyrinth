const { ChallengeTemplate, Adventure } = require("../classes");

/** @type {Record<string, ChallengeTemplate>} */
const CHALLENGES = {};

for (const file of [
	"cantholdallthisvalue.js",
	"intothedeepend.js",
	"restless.js",
	"rushing.js",
	"trainingweights.js",
	"unlabelledplacebos.js"
]) {
	/** @type {ChallengeTemplate} */
	const challenge = require(`./${file}`);
	CHALLENGES[challenge.name] = challenge;
}

const ROLLABLE_CHALLENGES = Object.keys(CHALLENGES).filter(challengeName => challengeName !== "Into the Deep End");

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
	getChallenge,
	rollChallenges
};
