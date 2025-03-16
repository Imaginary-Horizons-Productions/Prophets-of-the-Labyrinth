const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addModifier, addProtection, generateModifierResultLines } = require('../util/combatantUtil');
const { scalingRegeneration } = require('./shared/modifiers');
const { protectionScalingGenerator } = require('./shared/scalings');
const base = require('./carrot-base.js');

module.exports = new GearTemplate("Guarding Carrot",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and <@{protection}> protection to an ally and entice their pet to use its first move"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Earth"
).setCost(200)
	.setEffect(([target], user, adventure) => {
		const { scalings: { protection } } = module.exports;
		addProtection([target], protection.calculate(user));
		return base.effect([target], user, adventure, { extraResultLines: `${target.name} gains protection.` });
	}, { type: "single", team: "ally" })
	.setSidegrades("Balanced Carrot")
	.setCooldown(1)
	.setModifiers(scalingRegeneration(2))
	.setScalings({
		critBonus: 1,
		protection: protectionScalingGenerator(50)
	});
