const { EnemyTemplate, BuildError } = require("../classes");

/** @type {Record<string, EnemyTemplate>} */
const ENEMIES = {};
const ENEMY_NAMES = [];

for (const file of [
	"asteroid.js",
	"bloodtailhawk.js",
	"brute.js",
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
	if (enemy.name.toLowerCase() in ENEMIES) {
		throw new BuildError(`Duplicate enemy name (${enemy.name})`)
	}
	ENEMIES[enemy.name.toLowerCase()] = enemy;
	ENEMY_NAMES.push(enemy.name);
}

/** @param {string} enemyName */
function getEnemy(enemyName) {
	return ENEMIES[enemyName.toLowerCase()];
}

module.exports = {
	enemyNames: ENEMY_NAMES,
	getEnemy
}
