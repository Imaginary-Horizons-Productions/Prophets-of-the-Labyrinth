const { Enemy, EnemyTemplate, Adventure } = require("../classes");
const { getOpposite } = require("./elementUtil");
const { generateRuntimeTemplateStringRegExp } = require("./textUtil");

const anyTagRegex = generateRuntimeTemplateStringRegExp(null);

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 */
function spawnEnemy(enemyTemplate, adventure) {
	let enemy;
	if (enemyTemplate.name === "@{clone}") {
		const counterpart = adventure.delvers[adventure.room.enemies.length];
		enemy = new Enemy(enemyTemplate.name, adventure.scouting.bossesEncountered, counterpart.element, enemyTemplate.power + counterpart.gear.reduce((totalPower, currentGear) => totalPower + currentGear.power, 0), enemyTemplate.speed + counterpart.gear.reduce((totalSpeed, currentGear) => totalSpeed + currentGear.speed, 0), enemyTemplate.poiseExpression, counterpart.gear.reduce((totalCritRate, currentGear) => totalCritRate + currentGear.critRate, 0), enemyTemplate.firstAction, {}, adventure.delvers.length);
		enemy.name = `Mirror ${counterpart.archetype}`;
		enemy.setHP(enemyTemplate.maxHP + counterpart.gear.reduce((totalMaxHP, currentGear) => totalMaxHP + currentGear.maxHP, 0));
		enemy.poise += counterpart.gear.reduce((totalPoise, currentGear) => totalPoise + currentGear.poise, 0);
	} else {
		let pendingElement;
		switch (enemyTemplate.element) {
			case "@{adventure}":
				pendingElement = adventure.element;
				break;
			case "@{adventureOpposite}":
				pendingElement = getOpposite(adventure.element);
				break;
			default:
				pendingElement = enemyTemplate.element;
		}
		enemy = new Enemy(enemyTemplate.name, adventure.scouting.bossesEncountered, pendingElement, enemyTemplate.power ?? 0, enemyTemplate.speed, enemyTemplate.poiseExpression, enemyTemplate.critRate, enemyTemplate.firstAction, { ...enemyTemplate.startingModifiers }, adventure.delvers.length);
		let hpPercent = 85 + 15 * adventure.delvers.length;
		if (enemyTemplate.shouldRandomizeHP) {
			hpPercent += 10 * (2 - adventure.generateRandomNumber(5, "battle"));
		}
		const pendingHP = Math.ceil(enemyTemplate.maxHP * hpPercent / 100);
		enemy.setHP(pendingHP);
		enemy.name = enemyTemplate.name
			.replace(/@{adventure}/g, adventure.element)
			.replace(/@{adventureOpposite}/g, getOpposite(adventure.element));
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
