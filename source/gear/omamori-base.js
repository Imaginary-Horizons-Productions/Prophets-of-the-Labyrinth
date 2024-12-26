const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], protection, critMultiplier } = module.exports;
		const pendingFinesse = { ...finesse };
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Centering Omamori", "Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Finesse", stacks: 2 })
	.setProtection(50)
	.setCooldown(2);
