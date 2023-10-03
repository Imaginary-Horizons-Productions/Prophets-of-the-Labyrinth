const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("War Cry",
	"Inflict @{mod1Stacks} @{mod1} on a foe and all foes with Exposed",
	"@{mod1} +@{bonus}",
	"Technique",
	"Fire",
	200,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set().add(initialTarget.getName(adventure.room.enemyIdMap));
		const targetArray = [initialTarget];
		adventure.room.enemies.forEach(enemy => {
			if (enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
				targetSet.add(enemy.getName(adventure.room.enemyIdMap));
				targetArray.push(enemy);
			}
		})

		let { element, modifiers: [elementStagger, stagger], bonus } = module.exports;
		let pendingStaggerStacks = stagger.stacks;
		if (user.element === element) {
			pendingStaggerStacks += elementStagger.stacks;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		targetArray.forEach(target => {
			if (target.hp > 0) {
				addModifier(target, { name: "Stagger", stacks: pendingStaggerStacks });
			}
		})
		return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} staggered by the fierce war cry.`;
	}
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Charging War Cry", "Slowing War Cry", "Tormenting War Cry")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setBonus(1) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
