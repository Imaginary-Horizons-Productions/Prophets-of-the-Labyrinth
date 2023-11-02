const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing War Cry",
	"Inflict @{stagger} and @{mod0Stacks} @{mod0} on a foe and all foes with Exposed",
	"Stagger +@{bonus}",
	"Technique",
	"Fire",
	350,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set().add(initialTarget.getName(adventure.room.enemyIdMap));
		const targetArray = [initialTarget];
		adventure.room.enemies.forEach(enemy => {
			if (enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
				targetSet.add(enemy.getName(adventure.room.enemyIdMap));
				targetArray.push(enemy);
			}
		})

		let { element, modifiers: [slow], stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		targetArray.forEach(target => {
			if (target.hp > 0) {
				target.addStagger(pendingStaggerStacks);
				addModifier(target, slow);
			}
		})
		return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} Staggered and Slowed by the fierce war cry.`;
	}
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Charging War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
