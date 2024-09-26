const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Medicine",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingRegen.stacks *= critMultiplier;
		}
		return addModifier(targets, pendingRegen);
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Bouncing Medicine", "Cleansing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
