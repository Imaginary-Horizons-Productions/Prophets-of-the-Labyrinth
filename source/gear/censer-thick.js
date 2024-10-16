const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require("../util/combatantUtil");

module.exports = new GearTemplate("Thick Censer",
	[
		["use", "Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			resultLines.push(...generateModifierResultLines(addModifier([target], slow)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Staggering Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(30);
