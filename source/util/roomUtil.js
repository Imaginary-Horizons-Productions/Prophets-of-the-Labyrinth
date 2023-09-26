const { Enemy, EnemyTemplate, Adventure } = require("../classes");
const { generateRuntimeTemplateStringRegExp } = require("../helpers");
const { getOpposite } = require("./elementUtil");
// const { generateRandomNumber } = require("../helpers.js");

const anyTagRegex = generateRuntimeTemplateStringRegExp(null);

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 */
module.exports.spawnEnemy = function (enemyTemplate, adventure) {
	const enemy = new Enemy(enemyTemplate);
	let hpPercent = 85 + 15 * adventure.delvers.length;
	if (enemyTemplate.shouldRandomizeHP) {
		hpPercent += 10 * (2 - generateRandomNumber(adventure, 5, "battle"));
	}
	const pendingHP = Math.ceil(enemy.maxHp * hpPercent / 100);
	enemy.setHP(pendingHP);
	switch (enemyTemplate.name.match(anyTagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "adventure":
			enemy.name = enemy.name.replace("@{adventure}", adventure.element);
			break;
		case "adventureOpposite":
			enemy.name = enemy.name.replace("@{adventureOpposite}", getOpposite(adventure.element));
			break;
		case "clone":
			enemy.name = `Mirror ${adventure.delvers[adventure.room.enemies.length].archetype}`;
			break;
	}

	switch (enemyTemplate.element.match(anyTagRegex)?.[1]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "adventure":
			enemy.element = adventure.element;
			break;
		case "adventureOpposite":
			enemy.element = getOpposite(adventure.element);
			break;
		case "clone":
			enemy.element = adventure.delvers[adventure.room.enemies.length].element;
			break;
	}
	enemy.setId(adventure);
	adventure.room.enemies.push(enemy);
}
