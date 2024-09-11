const { GearTemplate } = require('../classes');
const { getModifierEmoji } = require('../modifiers/_modifierDictionary.js');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Slowing War Cry",
	[
		["use", `Inflict @{mod0Stacks} @{mod0} on a foe; also target all foes with ${getModifierEmoji("Exposed")}`],
		["Critical💥", "Stagger +@{bonus}"]
	],
	"Technique",
	"Light",
	350,
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
		changeStagger(targetArray, pendingStaggerStacks);
		addModifier(targetArray, slow).forEach((addedSlow, index) => {
			if (addedSlow) {
				slowedTargets.push(getNames([targetArray[index]], adventure)[0]);
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
