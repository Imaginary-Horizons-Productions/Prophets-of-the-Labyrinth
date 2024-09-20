const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Evasive Bow",
	[
		["use", "Strike a foe for @{damage} @{element} damage and gain @{mod0Stacks} @{mod0} with priority"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedEvade = addModifier([user], evade).length > 0;
		if (addedEvade) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Evade")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thief's Bow", "Unstoppable Bow")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setDurability(15)
	.setDamage(40)
	.setPriority(1);
