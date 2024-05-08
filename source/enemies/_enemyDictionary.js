const { EnemyTemplate, BuildError } = require("../classes");

/** @type {Record<string, EnemyTemplate>} */
const ENEMIES = {};

for (const file of [
	"asteroid.js",
	"bloodtailhawk.js",
	"clone.js",
	"earthlyknight.js",
	"elkemist.js",
	"firearrowfrog.js",
	"geodetortoise.js",
	"mechabeedrone.js",
	"mechabeesoldier.js",
	"mechaqueenbee.js",
	"mechaqueenmech.js",
	"meteorknight.js",
	"ooze.js",
	"royalslime.js",
	"slime.js",
	"starryknight.js",
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
	enemyNames: Object.keys(ENEMIES),
	getEnemy
}
