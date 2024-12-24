const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Centering Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [lucky], protection, critMultiplier, stagger } = module.exports;
		const hadStagger = user.stagger > 0;
		let pendingStagger = stagger;
		const pendingLucky = { ...lucky };
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger([user], user, pendingStagger);
		if (user.crit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const userEffects = ["gains protection"];
		if (hadStagger) {
			userEffects.push("shrugs off some Stagger");
		}
		return [`${user.name} ${listifyEN(userEffects)}.`].concat(generateModifierResultLines(addModifier([user], pendingLucky)));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setStagger(-2)
	.setCooldown(2);
