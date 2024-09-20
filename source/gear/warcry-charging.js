const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Charging War Cry",
	[
		["use", `Also target all foes with @{mod1} then gain @{mod0Stacks} @{mod0}`],
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

		const { element, modifiers: [powerup], stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		changeStagger(targetArray, pendingStaggerStacks);
		const resultLines = [joinAsStatement(false, [...targetSet], "was", "were", "Staggered.")];
		const addedPowerUp = addModifier([user], powerup).length > 0;
		if (addedPowerUp) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Power Up")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Slowing War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
