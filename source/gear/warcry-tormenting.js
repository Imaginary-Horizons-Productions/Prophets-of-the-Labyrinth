const { GearTemplate } = require('../classes');
const { isDebuff, getModifierEmoji } = require('../modifiers/_modifierDictionary.js');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Tormenting War Cry",
	[
		["use", `Duplicate debuffs on a foe; also target all foes with ${getModifierEmoji("Exposed")}`],
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
		const tormentTexts = "";
		changeStagger(targetArray, pendingStaggerStacks);
		targetArray.forEach(target => {
			const debuffs = [];
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					addModifier([target], { name: modifier, stacks: 1 });
					debuffs.push(modifier);
				}
			}
			if (debuffs.length > 0) {
				tormentTexts += ` ${getNames([target], adventure)[0]} gains ${listifyEN(debuffs, false)}.`;
			}
		})
		return `${listifyEN([...targetSet], false)} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.${tormentTexts}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Charging War Cry", "Slowing War Cry")
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
