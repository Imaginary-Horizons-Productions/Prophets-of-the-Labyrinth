const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Tormenting Enchantment Siphon",
	[
		["use", "Remove a single foe's protection and add @{bonus} stack to each of their debuffs, gain <@{protection} + removed protection> protection"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Defense",
	"Wind",
	350,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier, bonus } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const stolenProtection = target.protection;
		target.protection = 0;
		let pendingProtection = protection + Math.floor(user.getMaxHP() / 5) + stolenProtection;
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		const reciepts = [];
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				reciepts.push(...addModifier([target], { name: modifier, stacks: bonus }));
			}
		}
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`].concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
		} else {
			return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Enchantment Siphon")
	.setCooldown(1)
	.setProtection(0)
	.setBonus(1); // Debuff increment
