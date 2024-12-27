const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Earth",
	200,
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
	.setUpgrades("Hunter's Certain Victory", "Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Empowerment", stacks: 25 })
	.setPactCost([1, "Pay HP for your Empowerment after the move"])
	.setDamage(40)
	.setCooldown(0);
