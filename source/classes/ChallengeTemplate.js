
const { ThreadChannel } = require("discord.js");
const { Adventure } = require("./Adventure");
const { calculateTagContent } = require("../util/textUtil");
const { BuildError } = require("./BuildError");

class ChallengeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {number} intensityInput
	 */
	constructor(nameInput, descriptionInput, intensityInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!intensityInput) throw new BuildError("Falsy intensityInput");

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
	/** @type {((adventure: Adventure, thread: ThreadChannel) => void) | null} */
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

	/** @param {(adventure: Adventure, thread: ThreadChannel) => void} completeFunction */
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

module.exports = {
	ChallengeTemplate
}
