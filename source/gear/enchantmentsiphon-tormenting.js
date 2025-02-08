const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Tormenting Enchantment Siphon",
	[
		["use", "Remove a foe's protection and add @{debuffIncrement} stack to each of their debuffs, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { protection, critBonus, debuffIncrement } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const stolenProtection = target.protection;
		target.protection = 0;
		let pendingProtection = protection.calculate(user) + stolenProtection;
		if (user.crit) {
			pendingProtection *= critBonus;
		}
		addProtection([user], pendingProtection);
		const receipts = [];
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				receipts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
			}
		}
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
		} else {
			return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
		}
	}, { type: "single", team: "foe" })
	.setSidegrades("Flanking Enchantment Siphon")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2,
		debuffIncrement: 1
	});
