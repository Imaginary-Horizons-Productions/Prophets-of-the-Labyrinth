const { GearTemplate } = require('../classes/index.js');
const { addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Shattering Sabotage Kit",
	"Afflict a foe with @{mod0Stacks} @{mod0}, @{mod2Stacks} @{@mod2} and @{mod1Stacks} stacks of a random weakness",
	"Slow and Weakness +@{bonus}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow, weakness, frail], bonus } = module.exports;
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
		const addedFrail = addModifier(target, frail);
		if (addedFrail) {
			debuffTexts.push("becomes Frail");
		}
		if (debuffTexts.length > 0) {
			return `${target.getName(adventure.room.enemyIdMap)} ${listifyEN(debuffTexts)}.`;
		} else {
			return "But nothing happend.";
		}
	}
).setSidegrades("Long Sabotage Kit")
	.setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "unparsed random weakness", stacks: 2 }, { name: "Frail", stacks: 4 })
	.setBonus(2) // Crit Slow and Weakness stacks
	.setDurability(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });
