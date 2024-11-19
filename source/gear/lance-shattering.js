const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Lance",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and ([@{damage}] + [@{bonusSpeed}]) @{element} damage to a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [frail], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + Math.max(0, user.getSpeed(true) - 100) + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, frail)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Duelist's Lance", "Surpassing Lance")
	.setModifiers({ name: "Frail", stacks: 4 })
	.setDurability(15)
	.setDamage(40);
