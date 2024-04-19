const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier}",
	"Pact",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const regenedTargets = addModifier(targets, regen);
		return `${payHP(user, pendingHPCost, adventure)}${regenedTargets.length > 0 ? ` ${joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setHPCost(50)
	.setDurability(10);
