const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Bow",
	[
		["use", "Strike a foe for @{damage} @{essence} damage and gain @{mod0Stacks} @{mod0} with priority"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evade], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([user], evade)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Bow", "Unstoppable Bow")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setCooldown(1)
	.setDamage(40)
	.setPriority(1);
