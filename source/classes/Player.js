class Player {
	/** Represents a player's overall profile, including unlocked artifacts, archetypes, and pets as well as high scores
	 * @param {string} idInput
	 */
	constructor(idInput) {
		this.id = idInput;
		this.nextFreeRoll = Date.now();
		this.unlockRandomArchetype(3);
	}
	/** @type {{[guildId: string]: {total: number, high: number}}} */
	scores = {};
	/** @type {{[adventureId: string]: string}} adventureId for the adventure unlocked, pointing to artifact name */
	artifacts = { "start": "Phoenix Fruit Blossom" };
	/** @type {{[archetypeName: string]: number}} value is high score */
	archetypes = {};
	/** @type {{[petName: string]: number}} value is pet level (which should be on range [1-4])*/
	pets = {};
	favoritePet = "";

	/** @param {number} count */
	unlockRandomArchetype(count) {
		/** @type {string[]} */
		const rolledArchetypes = [];
		for (let i = 0; i < count; i++) {
			const pool = Object.entries(this.archetypes).reduce((pool, [archetype, highScore]) => {
				if (highScore === null) {
					pool.push(archetype);
				}
				return pool;
			}, []);

			if (pool.length < 1) {
				break;
			}
			const rolledArchetype = pool[Math.floor(pool.length * Math.random())];
			rolledArchetypes.push(rolledArchetype);
			this.archetypes[rolledArchetype] = 0;
		}
		return rolledArchetypes;
	}
};

module.exports = {
	Player
};
