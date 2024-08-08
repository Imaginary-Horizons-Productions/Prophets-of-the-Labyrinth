const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier}",
	"Pact",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return paymentSentence;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		const resultSentences = [paymentSentence];
		const regenedTargets = addModifier(targets, regen);
		if (regenedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setHPCost(50)
	.setDurability(10);
