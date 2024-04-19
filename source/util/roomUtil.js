const { Enemy, EnemyTemplate, Adventure } = require("../classes");
const { getOpposite } = require("./elementUtil");
const { generateRuntimeTemplateStringRegExp } = require("./textUtil");

const anyTagRegex = generateRuntimeTemplateStringRegExp(null);

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 */
function spawnEnemy(enemyTemplate, adventure) {
	const enemy = new Enemy(enemyTemplate.name, adventure.scouting.bossesEncountered, enemyTemplate.element, enemyTemplate.power ?? 0, enemyTemplate.speed, enemyTemplate.poiseExpression, enemyTemplate.critRate, enemyTemplate.firstAction, { ...enemyTemplate.startingModifiers }, adventure.delvers.length);
	if (enemy.archetype === "@{clone}") {
		const counterpart = adventure.delvers[adventure.room.enemies.length];
		enemy.name = `Mirror ${counterpart.archetype}`;
		enemy.element = counterpart.element;
		enemy.setHP(enemyTemplate.maxHP + counterpart.gear.reduce((totalMaxHP, currentGear) => totalMaxHP + currentGear.maxHP, 0));
		enemy.power += counterpart.gear.reduce((totalPower, currentGear) => totalPower + currentGear.power, 0);
		enemy.speed += counterpart.gear.reduce((totalSpeed, currentGear) => totalSpeed + currentGear.speed, 0);
		enemy.critRate += counterpart.gear.reduce((totalCritRate, currentGear) => totalCritRate + currentGear.critRate, 0);
		enemy.poise += counterpart.gear.reduce((totalPoise, currentGear) => totalPoise + currentGear.poise, 0);
	} else {
		let hpPercent = 85 + 15 * adventure.delvers.length;
		if (enemyTemplate.shouldRandomizeHP) {
			hpPercent += 10 * (2 - adventure.generateRandomNumber(5, "battle"));
		}
		const pendingHP = Math.ceil(enemyTemplate.maxHP * hpPercent / 100);
		enemy.setHP(pendingHP);
		enemy.name = enemyTemplate.name
			.replace("@{adventure}", adventure.element)
			.replace("@{adventureOpposite}", getOpposite(adventure.element));

		// Look for exact matches because element is a whitelist
		switch (enemyTemplate.element.match(anyTagRegex)?.[0]) {
			case "@{adventure}":
				enemy.element = adventure.element;
				break;
			case "@{adventureOpposite}":
				enemy.element = getOpposite(adventure.element);
				break;
		}
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
