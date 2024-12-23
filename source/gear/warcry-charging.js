const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Charging War Cry",
	[
		["use", "Stagger a single foe and all foes with @{mod1} then gain @{mod0Stacks} @{mod0}"],
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
		const { element, modifiers: [powerup, targetModifier], stagger, bonus } = module.exports;
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
		return [joinAsStatement(false, [...targetSet], "was", "were", "Staggered."), ...generateModifierResultLines(addModifier([user], powerup))];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Slowing War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Distracted", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setCooldown(1);
