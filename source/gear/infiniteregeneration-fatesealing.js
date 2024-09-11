const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	[
		["use", "Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier} and grant @{mod1Stacks} @{mod1}"]
	],
	"Pact",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen, stasis], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		let stasisedTargets = [];
		if (isCrit) {
			pendingHPCost /= critMultiplier;
			stasisedTargets = addModifier(targets, stasis);
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
		if (stasisedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(stasisedTargets, adventure), "enters", "enter", "Stasis."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Discounted Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 }, { name: "Stasis", stacks: 1 })
	.setHPCost(50)
	.setDurability(10);
