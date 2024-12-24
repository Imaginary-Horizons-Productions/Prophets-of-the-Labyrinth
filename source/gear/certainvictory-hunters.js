const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, payHP, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, gain @{mod0Stacks} @{mod0} (+@{mod1Stacks} on kill)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [empowerment, huntersEmpowerment], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const pendingEmpowerment = { ...empowerment };
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (target.hp < 1) {
			pendingEmpowerment.stacks += huntersEmpowerment.stacks;
		}
		return resultLines.concat(generateModifierResultLines(addModifier([user], empowerment)), payHP(user, user.getModifierStacks("Empowerment"), adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Empowerment", stacks: 25 }, { name: "Empowerment", stacks: 30 })
	.setDamage(40)
	.setPactCost([1, "Pay HP for your Empowerment after the move"]);
