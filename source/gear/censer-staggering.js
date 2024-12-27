const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Staggering Censer",
	[
		["use", "Burn a foe for <@{damage} + @{bonus} if target has any debuffs> @{essence} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [torpidity], stagger, damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (Object.keys(target.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff")) {
			pendingDamage += bonus;
		}
		changeStagger([target], user, pendingStagger);
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (user.crit && target.hp > 0) {
			resultLines.push(...generateModifierResultLines(addModifier([target], torpidity)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Chaining Censer", "Tormenting Censer")
	.setModifiers({ name: "Torpidity", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setStagger(2)
	.setCooldown(1);
