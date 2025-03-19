const { Enemy, EnemyTemplate, Adventure } = require("../classes");
const { RN_TABLE_BASE } = require("../constants");
const { anyDieSucceeds } = require("./mathUtil");

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 * @param {boolean} includeCoward
 */
function spawnEnemy(enemyTemplate, adventure, includeCoward = false) {
	const enemy = new Enemy(enemyTemplate.name, enemyTemplate.essence, enemyTemplate.shouldRandomizeHP, enemyTemplate.maxHP, enemyTemplate.power ?? 0, enemyTemplate.speed, enemyTemplate.staggerCapExpression, enemyTemplate.critRate, enemyTemplate.firstAction, { ...enemyTemplate.startingModifiers }, adventure);
	if (includeCoward) {
		enemy.modifiers.Cowardice = 1;
	}
	if (adventure.room.enemies) {
		adventure.room.enemies.push(enemy);
	} else {
		adventure.room.enemies = [enemy];
	}
}

/** @param {Adventure} adventure */
function rollGearTier(adventure) {
	const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
	const baseUpgradeChance = 1 / 8;
	const max = RN_TABLE_BASE ** 2;
	const threshold = max * anyDieSucceeds(baseUpgradeChance, cloverCount);
	adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Gear", (threshold / max) - baseUpgradeChance);
	const roll = adventure.generateRandomNumber(max, "general");
	if (roll >= 7 / 8 * max) {
		return "Cursed";
	} else if (roll < threshold) {
		return "Rare";
	} else {
		return "Common";
	}
}

module.exports = {
	spawnEnemy,
	rollGearTier
};
