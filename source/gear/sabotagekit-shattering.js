const { GearTemplate } = require('../classes/index.js');
const { addModifier, getCombatantWeaknesses, changeStagger, getNames } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Shattering Sabotage Kit",
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0}, @{mod2Stacks} @{@mod2} and @{mod1Stacks} stacks of a random weakness"],
		["Critical💥", "Slow and Weakness +@{bonus}"]
	],
	"Weapon",
	"Untyped",
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
			changeStagger([target], "elementMatchFoe");
		}
		const debuffTexts = [];
		const addedSlow = addModifier([target], pendingSlow).length > 0;
		if (addedSlow) {
			debuffTexts.push("is Slowed");
		}
		if (weaknessPool.length > 0) {
			const addedWeakness = addModifier([target], pendingWeakness).length > 0;
			if (addedWeakness) {
				debuffTexts.push(`gains ${pendingWeakness.name}`);
			}
		}
		const addedFrail = addModifier([target], frail).length > 0;
		if (addedFrail) {
			debuffTexts.push("becomes Frail");
		}
		if (debuffTexts.length > 0) {
			return `${getNames([target], adventure)[0]} ${listifyEN(debuffTexts, false)}.`;
		} else {
			return "But nothing happend.";
		}
	}
).setSidegrades("Long Sabotage Kit", "Urget Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "unparsed random weakness", stacks: 3 }, { name: "Frail", stacks: 4 })
	.setBonus(2) // Crit Slow and Weakness stacks
	.setDurability(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" });
