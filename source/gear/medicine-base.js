const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Medicine",
	"Grant an ally @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
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
		const regenedTargets = addModifier(targets, pendingRegen);
		if (regenedTargets.length > 0) {
			return joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
