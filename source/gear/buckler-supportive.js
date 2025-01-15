const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Supportive Buckler",
	[
		["use", "Grant an ally @{protection} protection and relieve them of @{stagger*-1} Stagger, then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Defense",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, stagger, protection, critMultiplier, modifiers: [swiftness] } = module.exports;
		let hadStagger = targets[0].stagger > 0;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_ALLY;
		}
		changeStagger(targets, user, pendingStagger);
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		if (hadStagger) {
			return [`${targets[0].name} gains protection and shrugs off some Stagger.`].concat(generateModifierResultLines(addModifier([user], swiftness)));
		} else {
			return [`${targets[0].name} gains protection.`].concat(generateModifierResultLines(addModifier([user], swiftness)));
		}
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Guarding Buckler")
	.setCooldown(1)
	.setProtection(75)
	.setStagger(-2)
	.setModifiers({ name: "Swiftness", stacks: 3 });
