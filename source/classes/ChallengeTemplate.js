
const { ThreadChannel } = require("discord.js");
const { Adventure } = require("./Adventure");
const { calculateTagContent } = require("../util/textUtil");
const { BuildError } = require("./BuildError");
const { injectApplicationEmojiMarkdown, injectApplicationEmojiName } = require("../util/graphicsUtil");

class ChallengeTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {number} intensityInput
	 * @param {boolean} isStartingChallenge
	 * @param {boolean} isRollableChallenge
	 */
	constructor(nameInput, descriptionInput, intensityInput, isStartingChallenge, isRollableChallenge) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!intensityInput) throw new BuildError("Falsy intensityInput");
		if (!(typeof isStartingChallenge === "boolean")) throw new BuildError("Non-boolean isStartingChallenge");
		if (!(typeof isRollableChallenge === "boolean")) throw new BuildError("Non-boolean isRollableChallenge");

		this.name = nameInput;
		this.description = descriptionInput;
		this.intensity = intensityInput;
		this.startingChallenge = isStartingChallenge;
		this.rollableChallenge = isRollableChallenge;
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
	dynamicDescription(intensity, duration, reward, markdownAllowed) {
		const emojiParsed = markdownAllowed ? injectApplicationEmojiMarkdown(this.description) : injectApplicationEmojiName(this.description);
		return calculateTagContent(emojiParsed, { intensity, duration, reward });
	}
};

module.exports = {
	ChallengeTemplate
}
