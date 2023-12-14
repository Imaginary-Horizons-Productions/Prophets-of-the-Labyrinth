const { Enemy, EnemyTemplate, Adventure } = require("../classes");
const { getOpposite } = require("./elementUtil");
const { generateRuntimeTemplateStringRegExp } = require("./textUtil");

const anyTagRegex = generateRuntimeTemplateStringRegExp(null);

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 */
function spawnEnemy(enemyTemplate, adventure) {
	const enemy = new Enemy(enemyTemplate.name, enemyTemplate.element, enemyTemplate.power, enemyTemplate.speed, enemyTemplate.poiseExpression, enemyTemplate.critRate, enemyTemplate.firstAction, { ...enemyTemplate.startingModifiers }, adventure.delvers.length);
	let hpPercent = 85 + 15 * adventure.delvers.length;
	if (enemyTemplate.shouldRandomizeHP) {
		hpPercent += 10 * (2 - adventure.generateRandomNumber(5, "battle"));
	}
	const pendingHP = Math.ceil(enemyTemplate.maxHP * hpPercent / 100);
	enemy.setHP(pendingHP);
	switch (enemyTemplate.name.match(anyTagRegex)?.[0]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "@{adventure}":
			enemy.name = enemyTemplate.name.replace("@{adventure}", adventure.element);
			break;
		case "@{adventureOpposite}":
			enemy.name = enemyTemplate.name.replace("@{adventureOpposite}", getOpposite(adventure.element));
			break;
		case "@{clone}":
			enemy.name = `Mirror ${adventure.delvers[adventure.room.enemies.length].archetype}`;
			break;
	}

	switch (enemyTemplate.element.match(anyTagRegex)?.[0]) { // this prevents all replaces from running; which is problematic because @{clone} assumes player and enemy counts match
		case "@{adventure}":
			enemy.element = adventure.element;
			break;
		case "@adventureOpposite}":
			enemy.element = getOpposite(adventure.element);
			break;
		case "@{clone}":
			enemy.element = adventure.delvers[adventure.room.enemies.length].element;
			break;
	}
	enemy.setId(adventure);
	if (adventure.room.enemies) {
		adventure.room.enemies.push(enemy);
	} else {
		adventure.room.enemies = [enemy];
	}
}

module.exports = {
	spawnEnemy
};
