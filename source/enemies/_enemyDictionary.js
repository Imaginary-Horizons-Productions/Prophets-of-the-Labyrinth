const { EnemyTemplate, BuildError } = require("../classes");

/** @type {Record<string, EnemyTemplate>} */
const ENEMIES = {};

for (const file of [
	"bloodtailhawk.js",
	"clone.js",
	"elkemist.js",
	"firearrowfrog.js",
	"geodetortoise.js",
	"mechabee.js",
	"mechaqueen.js",
	"ooze.js",
	"royalslime.js",
	"slime.js",
	"treasureelemental.js"
]) {
	/** @type {EnemyTemplate} */
	const enemy = require(`./${file}`);
	if (enemy.name in ENEMIES) {
		throw new BuildError(`Duplicate enemy name (${enemy.name})`)
	}
	ENEMIES[enemy.name] = enemy;
}

/** @param {string} enemyName */
function getEnemy(enemyName) {
	return ENEMIES[enemyName];
}

module.exports = {
	getEnemy
}
