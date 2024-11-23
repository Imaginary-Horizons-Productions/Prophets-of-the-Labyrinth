const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');

module.exports = new GearTemplate("Tormenting War Cry",
	[
		["use", "Duplicate debuffs on a foe and Stagger them; also target all foes with @{mod0}"],
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
		const { element, stagger, bonus, modifiers: [targetModifier] } = module.exports;
		for (const enemy of adventure.room.enemies) {
			if (enemy.hp > 0 && enemy.getModifierStacks(targetModifier.name) > 0 && !targetSet.has(enemy.name)) {
				targetSet.add(enemy.name);
				targetArray.push(enemy);
			}
		}

		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (user.crit) {
			pendingStaggerStacks += bonus;
		}
		const resultLines = [joinAsStatement(false, [...targetSet], "was", "were", "Staggered.")];
		changeStagger(targetArray, pendingStaggerStacks);
		const receipts = [];
		for (const target of targetArray) {
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					receipts.push(...addModifier([target], { name: modifier, stacks: 1 }));
				}
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging War Cry", "Slowing War Cry")
	.setModifiers({ name: "Distracted", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
