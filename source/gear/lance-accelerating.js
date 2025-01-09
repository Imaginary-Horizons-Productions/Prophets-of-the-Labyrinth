const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Accelerating Lance",
	[
		["use", "Gain @{protection} protection and @{mod0Stacks} @{mod0}, then deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Action",
	"Water",
	0,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier, modifiers: [swiftness] } = module.exports;
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, user.getPower(), false, essence, adventure).concat(`${user.name} gains protection.`, generateModifierResultLines(addModifier([user], swiftness)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setProtection(25)
	.setModifiers({ name: "Swiftness", stacks: 3 });
