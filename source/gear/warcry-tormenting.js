const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Tormenting War Cry",
	"Inflict @{stagger} and duplicate debuffs on a foe and all foes with Exposed",
	"Stagger +@{bonus}",
	"Technique",
	"Fire",
	350,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(initialTarget.getName(adventure.room.enemyIdMap));
			targetArray.push(initialTarget);
		}
		adventure.room.enemies.forEach(enemy => {
			if (enemy.hp > 0 && enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
				targetSet.add(enemy.getName(adventure.room.enemyIdMap));
				targetArray.push(enemy);
			}
		})

		let { element, stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		const tormentTexts = [];
		targetArray.forEach(target => {
			const debuffs = [];
			target.addStagger(pendingStaggerStacks);
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					addModifier(target, { name: modifier, stacks: 1 });
					debuffs.push(modifier);
				}
			}
			if (debuffs.length > 0) {
				tormentTexts.push(`${target.getName(adventure.room.enemyIdMap)} gains ${debuffs.join(", ")}.`);
			}
		})
		return `${[...targetSet].join(", ")} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.${tormentTexts.length > 0 ? ` ${tormentTexts.join(" ")}` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Charging War Cry", "Slowing War Cry")
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
