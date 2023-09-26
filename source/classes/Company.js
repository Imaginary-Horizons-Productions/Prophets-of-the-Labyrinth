class Company {
	/** Represents metrics data and channel management data for a guild
	 * @param {string} idInput
	 */
	constructor(idInput) {
		this.id = idInput;
	}
	/** @type {string[]} */
	userIds = [];
	/** @type {Set<string>} */
	adventuring = new Set();
	highScore = {
		score: 0,
		/** @type {string[]} */
		playerIds: [],
		adventure: ""
	};
};

module.exports = {
	Company
};
