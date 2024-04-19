const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Discounted Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier}",
	"Pact",
	"Light",
	100,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const addedRegen = addModifier(targets, regen).length > 0;
		return `${payHP(user, pendingHPCost, adventure)}${addedRegen ? ` ${joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "Regen.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setHPCost(50)
	.setDurability(10);
