// const { calculateTagContent } = require("../helpers");

const { ThreadChannel } = require("discord.js");

class ChallengeTemplate { //TODONOW finish
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {number} intensityInput
	 */
	constructor(nameInput, descriptionInput, intensityInput) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.intensity = intensityInput;
	}
	/** @type {number | null} */
	duration = null;
	/** @type {number} */
	scoreMultiplier = 1;
	/** @type {number} */
	reward = 0;
	/** @type {((adventure, thread: ThreadChannel) => void) | null} */
	complete = null;

	/** @param {number} durationInput integer - number of rooms */
	setDuration(durationInput) {
		this.duration = durationInput;
		return this;
	}

	/** @param {number} multiplierInput */
	setScoreMultiplier(multiplierInput) {
		this.scoreMultiplier = multiplierInput;
		return this;
	}

	/** @param {number} rewardInput */
	setReward(rewardInput) {
		this.reward = rewardInput;
		return this;
	}

	/** @param {(adventure, thread: ThreadChannel) => void} completeFunction */
	setCompleteEffect(completeFunction) {
		this.complete = completeFunction;
		return this;
	}

	/** takes parameters to support reading in both baseline values and live adventure values
	 * @param {number} intensity
	 * @param {number} duration
	 * @param {number} reward
	 */
	dynamicDescription(intensity, duration, reward) {
		return calculateTagContent(this.description, [
			{ tag: 'intensity', count: intensity },
			{ tag: 'duration', count: duration },
			{ tag: 'reward', count: reward }
		]);
	}
};

class Challenge {
	/**
	 * @param {number} intensityInput
	 * @param {number} rewardInput
	 * @param {number | null} durationInput
	 */
	constructor(intensityInput, rewardInput, durationInput) {
		this.intensity = intensityInput;
		this.reward = rewardInput;
		this.duration = durationInput;
	}
}

module.exports = {
	ChallengeTemplate,
	Challenge
}
