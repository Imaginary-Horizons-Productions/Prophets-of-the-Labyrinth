const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Bow",
	[
		["use", "Strike a foe for @{damage} @{element} damage and gain @{mod0Stacks} @{mod0} with priority"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [evade], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([user], evade)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Bow", "Unstoppable Bow")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setCooldown(1)
	.setDamage(40)
	.setPriority(1);
