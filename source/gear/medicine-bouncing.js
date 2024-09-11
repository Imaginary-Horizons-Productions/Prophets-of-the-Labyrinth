const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Bouncing Medicine",
	[
		["use", "Grant 3 random allies @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingRegen.stacks *= critMultiplier;
		}
		const regenedTargets = addModifier(targets, pendingRegen);
		if (regenedTargets.length > 0) {
			return joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
