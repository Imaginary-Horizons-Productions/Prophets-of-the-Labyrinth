const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Slowing War Cry",
	"Inflict @{foeStagger} and @{mod0Stacks} @{mod0} on a foe and all foes with Exposed",
	"Stagger +@{bonus}",
	"Technique",
	"Fire",
	350,
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

		const { element, modifiers: [slow], stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		let resultText = `${listifyEN([...targetSet], false)} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.`;
		const slowedTargets = [];
		targetArray.forEach(target => {
			target.addStagger(pendingStaggerStacks);
			const addedSlow = addModifier(target, slow);
			if (addedSlow) {
				slowedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
		})
		if (slowedTargets.length > 1) {
			resultText += ` ${listifyEN(slowedTargets), false} are Slowed.`;
		} else if (slowedTargets.length > 0) {
			resultText += ` ${slowedTargets[0]} is Slowed.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Charging War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
