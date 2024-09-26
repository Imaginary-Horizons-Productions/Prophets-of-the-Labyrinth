const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Discounted Infinite Regeneration",
	[
		["use", "Pay @{hpCost} HP to grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "HP Cost / @{critMultiplier}"]
	],
	"Pact",
	"Fire",
	100,
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
		const resultLines = [paymentSentence];
		const regenedTargets = addModifier(targets, regen);
		if (regenedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Regen")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Infinite Regeneration", "Purifying Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 })
	.setHPCost(50)
	.setDurability(10);
