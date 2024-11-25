const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Censer",
	[
		["use", "Burn a foe for <@{damage} + @{bonus} if target has any debuffs> @{element} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	200,
	([target], user, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (Object.keys(target.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff")) {
			pendingDamage += bonus;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (user.crit && target.hp > 0) {
			resultLines.push(...generateModifierResultLines(addModifier([target], slow)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Staggering Censer", "Tormenting Censer", "Unbreakable Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);
