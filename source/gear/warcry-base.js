const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("War Cry",
	[
		["use", `Also target all foes with @{mod0}`],
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
		for (const enemy of adventure.room.enemies) {
			if (enemy.hp > 0 && enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.name)) {
				targetSet.add(enemy.name);
				targetArray.push(enemy);
			}
		}

		const { element, stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (user.crit) {
			pendingStaggerStacks += bonus;
		}
		changeStagger(targetArray, pendingStaggerStacks);
		return [joinAsStatement(false, [...targetSet], "was", "were", "Staggered.")];
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setUpgrades("Charging War Cry", "Slowing War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Exposed", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
