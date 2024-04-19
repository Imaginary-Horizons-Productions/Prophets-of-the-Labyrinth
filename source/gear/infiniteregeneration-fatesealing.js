const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier} and grant @{mod1Stacks} @{mod1}",
	"Pact",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen, stasis], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		let stasisedTargets = [];
		if (isCrit) {
			pendingHPCost /= critMultiplier;
			stasisedTargets.concat(addModifier(targets, stasis)).length > 0;
		}
		const regenedTargets = addModifier(targets, regen);
		return `${payHP(user, pendingHPCost, adventure)}${regenedTargets.length > 0 ? ` ${joinAsStatement(false, regenedTargets, "gains", "gain", "Regen.")}` : ""}${stasisedTargets.length > 0 ? ` ${joinAsStatement(false, stasisedTargets, "enters", "enter", "Stasis.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Discounted Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 }, { name: "Stasis", stacks: 1 })
	.setHPCost(50)
	.setDurability(10);
