const { GearTemplate } = require('../classes');
const { addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Long Sabotage Kit",
	"Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random weakness",
	"Slow and Weakness +@{bonus}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow, weakness], bonus } = module.exports;
		const pendingSlow = { ...slow };
		const pendingWeakness = { stacks: weakness.stacks };
		const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
		const weaknessPool = elementsList(ineligibleWeaknesses);
		pendingWeakness.name = `${weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "battle")]} Weakness`;
		if (isCrit) {
			pendingSlow.stacks += bonus;
			pendingWeakness.stacks += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const debuffTexts = [];
		const addedSlow = addModifier(target, pendingSlow);
		if (addedSlow) {
			debuffTexts.push("is Slowed");
		}
		if (weaknessPool.length > 0) {
			const addedWeakness = addModifier(target, pendingWeakness);
			if (addedWeakness) {
				debuffTexts.push(`gains ${pendingWeakness.name}`);
			}
		}
		if (debuffTexts.length > 0) {
			return `${target.getName(adventure.room.enemyIdMap)} ${listifyEN(debuffTexts, false)}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setSidegrades("Shattering Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Slow", stacks: 3 }, { name: "unparsed random weakness", stacks: 3 })
	.setBonus(2) // Crit Slow and Weakness stacks
	.setDurability(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });
