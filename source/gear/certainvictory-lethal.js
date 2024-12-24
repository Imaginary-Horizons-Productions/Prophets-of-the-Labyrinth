const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(
			generateModifierResultLines(addModifier([user], empowerment)),
			payHP(user, user.getModifierStacks("Empowerment"), adventure)
		);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Hunter's Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Empowerment", stacks: 25 })
	.setDamage(40)
	.setCritMultiplier(3)
	.setPactCost([1, "Pay HP for your Empowerment after the move"]);
