const { EnemyTemplate, BuildError } = require("../classes");

/** @type {Record<string, EnemyTemplate>} */
const ENEMIES = {};
const ENEMY_NAMES = [];

for (const file of [
	"asteroid.js",
	"bloodtailhawk.js",
	"brute.js",
	"ck-cometthesundog.js",
	"ck-gaiaknightess.js",
	"ck-lunamilitissa.js",
	"ck-meteorknight.js",
	"ck-spacedustcadet.js",
	"ck-starryknight.js",
	"elegantstella.js",
	"elkemist.js",
	"firearrowfrog.js",
	"geodetortoise.js",
	"gustwolf.js",
	"mechabeedrone.js",
	"mechabeesoldier.js",
	"mechaqueenbee.js",
	"mechaqueenmech.js",
	"mirrorclone.js",
	"ooze.js",
	"pulsarzebra.js",
	"royalslime.js",
	"slime.js",
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
