const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, payHP, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reckless Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [powerUp, exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const receipts = addModifier([user], powerUp).concat(addModifier([user], exposed));
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)), payHP(user, user.getModifierStacks("Power Up"), adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Hunter's Certain Victory", "Lethal Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Exposed", stacks: 1 })
	.setPactCost([1, "Pay HP for your Power Up after the move"])
	.setDamage(90);
