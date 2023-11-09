const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("War Cry",
	"Inflict @{stagger} on a foe and all foes with Exposed",
	"Stagger +@{bonus}",
	"Technique",
	"Fire",
	200,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(initialTarget.getName(adventure.room.enemyIdMap));
			targetArray.push(initialTarget);
		}
		adventure.room.enemies.forEach(enemy => {
			if (enemy.hp > 0 && enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
				targetSet.add(enemy.getName(adventure.room.enemyIdMap));
				targetArray.push(enemy);
			}
		})

		let { element, stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		targetArray.forEach(target => {
			target.addStagger(pendingStaggerStacks);
		})
		return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: false })
	.setUpgrades("Charging War Cry", "Slowing War Cry", "Tormenting War Cry")
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
