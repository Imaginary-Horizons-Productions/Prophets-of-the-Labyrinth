const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Tormenting War Cry",
	[
		["use", `Duplicate debuffs on a foe; also target all foes with @{mod0}`],
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

		const { element, stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		const resultLines = [joinAsStatement(false, [...targetSet], "was", "were", "Staggered.")];
		changeStagger(targetArray, pendingStaggerStacks);
		const targetNames = getNames(targetArray, adventure);
		targetArray.forEach((target, i) => {
			const debuffs = [];
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					addModifier([target], { name: modifier, stacks: 1 });
					debuffs.push(getApplicationEmojiMarkdown(modifier));
				}
			}
			if (debuffs.length > 0) {
				resultLines.push(`${targetNames[i]} gains ${debuffs.join("")}.`);
			}
		})
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Charging War Cry", "Slowing War Cry")
	.setModifiers({ name: "Exposed", stacks: 0 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
