const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Slowing War Cry",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and Stagger on a foe; also target all foes with @{mod1}"],
		["Critical💥", "Stagger +@{bonus}"]
	],
	"Technique",
	"Light",
	350,
	([initialTarget], user, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(initialTarget.name);
			targetArray.push(initialTarget);
		}
		const { element, modifiers: [slow, targetModifier], stagger, bonus } = module.exports;
		for (const enemy of adventure.room.enemies) {
			if (enemy.hp > 0 && enemy.getModifierStacks(targetModifier.name) > 0 && !targetSet.has(enemy.name)) {
				targetSet.add(enemy.name);
				targetArray.push(enemy);
			}
		}

		let pendingStagger = stagger;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger += bonus;
		}
		changeStagger(targetArray, user, pendingStagger);
		return [joinAsStatement(false, [...targetSet], "was", "were", "Staggered."), ...generateModifierResultLines(combineModifierReceipts(addModifier(targetArray, slow)))];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Slow", stacks: 1 }, { name: "Distracted", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
