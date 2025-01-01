const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Enchantment Siphon",
	[
		["use", "Remove a single foe's protection and inflict @{mod0Stacks} @{mod0} on them, gain <@{protection} + removed protection> protection"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Defense",
	"Wind",
	350,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier, modifiers: [exposure] } = module.exports;
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
		const resultLines = generateModifierResultLines(addModifier([target], { name: exposure.name, stacks: exposure.stacks.generator(user) }));
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`].concat(resultLines);
		} else {
			return [`${user.name} gains protection.`].concat(resultLines);
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Tormenting Enchantment Siphon")
	.setCooldown(1)
	.setProtection(0)
	.setModifiers({ name: "Exposure", stacks: { description: "1 + Bonus Speed / 10", generator: (user) => 1 + Math.floor(user.getBonusSpeed() / 10) } });
