const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { scalingExposure } = require('./shared/modifiers');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Flanking Enchantment Siphon",
	[
		["use", "Remove a foe's protection and inflict <@{mod0Stacks}> @{mod0} on them, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { protection, critBonus }, modifiers: [exposure] } = module.exports;
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
		const resultLines = generateModifierResultLines(addModifier([target], { name: exposure.name, stacks: exposure.stacks.calculate(user) }));
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`].concat(resultLines);
		} else {
			return [`${user.name} gains protection.`].concat(resultLines);
		}
	}, { type: "single", team: "foe" })
	.setSidegrades("Tormenting Enchantment Siphon")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2
	})
	.setModifiers(scalingExposure(1));
