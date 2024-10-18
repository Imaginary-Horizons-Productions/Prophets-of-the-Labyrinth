const { GearTemplate } = require('../classes');
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
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingLucky)));
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setUpgrades("Centering Omamori", "Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10);
