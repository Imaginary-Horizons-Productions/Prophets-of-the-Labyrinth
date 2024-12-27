const { GearTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

module.exports = new GearTemplate("Tormenting Censer",
	[
		["use", "Burn a foe for <@{damage} + @{bonus} if target has any debuffs> @{essence} damage, duplicate its debuffs"],
		["Critical💥", "Also apply @{mod0Stacks} @{mod0}"]
	],
	"Trinket",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [torpidity], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (targetDebuffs.length > 0) {
			pendingDamage += bonus;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (target.hp > 0) {
			const receipts = [];
			if (user.crit) {
				receipts.push(...addModifier([target], torpidity));
			}
			for (const modifier of targetDebuffs) {
				receipts.push(...addModifier([target], { name: modifier, stacks: 1 }));
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(receipts)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Chaining Censer", "Staggering Censer")
	.setModifiers({ name: "Torpidity", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setCooldown(1);
