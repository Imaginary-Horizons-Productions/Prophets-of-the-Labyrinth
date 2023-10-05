const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');

module.exports = new GearTemplate("Long Sabotage Kit",
	"Afflict a foe with @{mod0Stacks} @{mod0} and a random weakness",
	"Slow and Weakness +@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow, elementStagger, critSlow] } = module.exports;
		const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
		const weaknessPool = elementsList(ineligibleWeaknesses);
		const rolledWeakness = `${weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "battle")]} Weakness`;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critSlow);
			if (weaknessPool.length > 0) {
				addModifier(target, { name: rolledWeakness, stacks: 5 });
			}
		} else {
			addModifier(target, slow);
			if (weaknessPool.length > 0) {
				addModifier(target, { name: rolledWeakness, stacks: 3 });
			}
		}
		return `${target.getName(adventure.room.enemyIdMap)} is Slowed${weaknessPool.length > 0 ? `, and gains ${rolledWeakness}` : ""}.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Slow", stacks: 3 }, { name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 5 }])
	.setDurability(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });
