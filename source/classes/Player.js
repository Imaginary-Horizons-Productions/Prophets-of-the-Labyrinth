class Player {
	/** Represents a player's overall profile, including unlocked artifacts, archetypes, and pets as well as high scores
	 * @param {string} idInput
	 */
	constructor(idInput) {
		this.id = idInput;
		this.nextFreeRoll = Date.now();
	}
	bonusDrafts = 0;
	guildInfluence = 0;
	draftCount = 0;
	/** @type {{[guildId: string]: {total: number, high: number}}} */
	scores = {};
	/** @type {{[adventureId: string]: string}} adventureId for the adventure unlocked, pointing to artifact name */
	artifacts = { "start": "Phoenix Fruit Blossom" };
	/** @type {{[archetypeName: string]: { specializationsUnlocked: number, highScore: number }}} */
	archetypes = {};
	/** @type {{[petName: string]: number}} value is pet level (which should be on range [1-4])*/
	pets = {};
	favoriteArchetype = "";
	favoritePet = "";
};

module.exports = {
	Player
};
