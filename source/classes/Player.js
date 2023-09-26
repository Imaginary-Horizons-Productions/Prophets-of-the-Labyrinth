class Player {
	/** Represents a player's overall profile, including unlocked artifacts and archetypes and score
	 * @param {string} idInput
	 */
	constructor(idInput) {
		this.id = idInput;
		this.nextFreeRoll = Date.now();
	}
	/** @type {{[guildId: string]: {total: number, high: number}}} */
	scores = {};
	/** @type {{[adventureId: string]: string}} adventureId for the adventure unlocked, pointing to artifact name */
	artifacts = { "start": "Phoenix Fruit Blossom" };
	/** @type {{[archetypeName: string]: highScore}} set highScore to null to signify "not unlocked yet" */
	archetypes = { "Knight": null, "Assassin": null, "Chemist": null, "Martial Artist": null, "Hemomancer": null, "Ritualist": null, "Legionnaire": null };

	/** @param {number} count */
	unlockRandomArchetype(count) {
		/** @type {string[]} */
		const rolledArchetypes = [];
		for (let i = 0; i < count; i++) {
			const pool = Object.entries(this.archetypes).reduce((pool, [archetype, highScore]) => {
				if (highScore === null) {
					pool.push(archetype);
				}
			}, []);

			if (pool.length < 1) {
				break;
			}
			const rolledArchetype = pool[Math.floor(pool.length * Math.random())]
			rolledArchetypes.push(rolledArchetype);
			this.archetypes[rolledArchetype] = 0;
		}
		return rolledArchetypes;
	}
};

module.exports = {
	Player
};
