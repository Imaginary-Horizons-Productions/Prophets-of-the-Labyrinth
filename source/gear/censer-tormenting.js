const { GearTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Tormenting Censer",
	[
		["use", "Burn a foe for @{damage} (+@{bonus} if target has debuffs) @{element} damage, duplicate its debuffs"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp > 0) {
			const receipts = [];
			if (user.crit) {
				receipts.push(...addModifier([target], slow));
			}
			for (const modifier in target.modifiers) {
				if (isDebuff(modifier)) {
					receipts.push(...addModifier([target], { name: modifier, stacks: 1 }));
				}
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(receipts)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Staggering Censer", "Thick Censer")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);
