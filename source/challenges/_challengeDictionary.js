const { ChallengeTemplate, Adventure } = require("../classes");

/** @type {Record<string, ChallengeTemplate>} */
const CHALLENGES = {};

for (const file of [
	"blindavarice.js",
	"cantholdallthisvalue.js",
	// "restless.js",
	// "rushing.js"
]) {
	/** @type {ChallengeTemplate} */
	const challenge = require(`./${file}`);
	CHALLENGES[challenge.name] = challenge;
}

/** @param {string} challengeName */
exports.getChallenge = function (challengeName) {
	return CHALLENGES[challengeName];
}

/**
 * @param {number} rolls
 * @param {Adventure} adventure
 */
exports.rollChallenges = function (rolls, adventure) {
	let challenges = [];
	let challengeNames = Object.keys(CHALLENGES);
	for (let i = 0; i < rolls; i++) {
		let rolledChallenge = challengeNames[adventure.generateRandomNumber(challengeNames.length, "general")];
		if (!challenges.includes(rolledChallenge)) {
			challenges.push(rolledChallenge);
		}
	}
	return challenges;
}
