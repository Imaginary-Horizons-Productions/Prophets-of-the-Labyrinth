const { GearTemplate } = require('../classes/index.js');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Staggering Censer",
	[
		["use", "Burn a foe for <@{damage} + @{bonus} if target has any debuffs> @{element} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [slow], stagger, damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		changeStagger([target], stagger);
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (user.crit && target.hp > 0) {
			resultLines.push(...generateModifierResultLines(addModifier([target], slow)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Tormenting Censer", "Unbreakable Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setStagger(2)
	.setDurability(15);
