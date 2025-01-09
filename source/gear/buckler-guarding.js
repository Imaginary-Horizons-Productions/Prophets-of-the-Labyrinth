const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Guarding Buckler",
	[
		["use", "Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Defense",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier, modifiers: [swiftness] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		return [`${targets[0].name} gains protection.`].concat(generateModifierResultLines(addModifier([user], swiftness)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Supportive Buckler")
	.setCooldown(1)
	.setProtection(150)
	.setModifiers({ name: "Swiftness", stacks: 3 });
