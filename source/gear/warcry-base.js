const { GearTemplate } = require('../classes');
const { changeStagger, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("War Cry",
	"Inflict @{foeStagger} on a foe and all foes with Exposed",
	"Stagger +@{bonus}",
	"Technique",
	"Light",
	200,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(getNames([initialTarget], adventure)[0]);
			targetArray.push(initialTarget);
		}
		adventure.room.enemies.forEach(enemy => {
			const enemyName = getNames([enemy], adventure)[0];
			if (enemy.hp > 0 && enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemyName)) {
				targetSet.add(enemyName);
				targetArray.push(enemy);
			}
		})

		const { element, stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		changeStagger(targetArray, pendingStaggerStacks);
		return `${listifyEN([...targetSet], false)} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setUpgrades("Charging War Cry", "Slowing War Cry", "Tormenting War Cry")
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
