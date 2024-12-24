const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("War Cry",
	[
		["use", "Stagger a single foe and all foes with @{mod0}"],
		["Critical💥", "Stagger +@{bonus}"]
	],
	"Technique",
	"Light",
	200,
	([initialTarget], user, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(initialTarget.name);
			targetArray.push(initialTarget);
		}
		const { essence, stagger, bonus, modifiers: [targetModifier] } = module.exports;
		for (const enemy of adventure.room.enemies) {
			if (enemy.hp > 0 && enemy.getModifierStacks(targetModifier.name) > 0 && !targetSet.has(enemy.name)) {
				targetSet.add(enemy.name);
				targetArray.push(enemy);
			}
		}

		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger += bonus;
		}
		changeStagger(targetArray, user, pendingStagger);
		return [joinAsStatement(false, [...targetSet], "was", "were", "Staggered.")];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Charging War Cry", "Slowing War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Distracted", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setCooldown(1);
