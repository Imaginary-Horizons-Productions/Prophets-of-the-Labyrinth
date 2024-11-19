const { GearTemplate } = require('../classes');
const { changeStagger, payHP, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Toxic Air Blades",
	[
		["use", "Pay @{hpCost} HP, then inflict @{damage} @{element} damage twice and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, hpCost, damage, critMultiplier, modifiers: [poison] } = module.exports;
		const resultLines = [payHP(user, hpCost, adventure)];
		if (adventure.lives < 1) {
			return resultLines;
		}
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, element, adventure), dealDamage(targets, user, pendingDamage, false, element, adventure), generateModifierResultLines(addModifier(targets, poison)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Accelerating Air Blade", "Unstoppable Air Blade")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(Infinity)
	.setDamage(20)
	.setHPCost(25);
