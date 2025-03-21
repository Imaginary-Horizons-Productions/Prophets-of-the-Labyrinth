const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Guarding Buckler",
	[
		["use", "Grant an ally <@{protection}> protection and gain @{mod0Stacks} @{mod0}"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { protection, critBonus }, modifiers: [swiftness] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingProtection = protection.calculate(user);
		if (user.crit) {
			pendingProtection *= critBonus;
		}
		addProtection(targets, pendingProtection);
		return [`${targets[0].name} gains protection.`].concat(generateModifierResultLines(addModifier([user], swiftness)));
	}, { type: "single", team: "ally" })
	.setSidegrades("Supportive Buckler")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(150),
		critBonus: 2
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });
