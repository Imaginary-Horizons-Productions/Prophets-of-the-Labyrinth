const { Enemy, EnemyTemplate, Adventure } = require("../classes");

/**
 * @param {EnemyTemplate} enemyTemplate can't do fetch inline due to circular dependency in enemies spawning enemies as moves
 * @param {Adventure} adventure
 */
function spawnEnemy(enemyTemplate, adventure) {
	const enemy = new Enemy(enemyTemplate.name, enemyTemplate.element, enemyTemplate.shouldRandomizeHP, enemyTemplate.maxHP, enemyTemplate.power ?? 0, enemyTemplate.speed, enemyTemplate.poiseExpression, enemyTemplate.critRate, enemyTemplate.firstAction, { ...enemyTemplate.startingModifiers }, adventure);
	if (adventure.room.enemies) {
		adventure.room.enemies.push(enemy);
	} else {
		adventure.room.enemies = [enemy];
	}
}

module.exports = {
	spawnEnemy
};
