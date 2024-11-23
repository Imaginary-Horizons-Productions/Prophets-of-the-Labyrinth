const { GearTemplate } = require('../classes');
const { changeStagger, payHP, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { unbreakablePassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Accelerating Air Blades",
	[
		unbreakablePassive,
		["use", "Pay @{hpCost} HP, then strike a foe for @{damage} @{element} damage twice and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, hpCost, damage, critMultiplier, modifiers: [quicken] } = module.exports;
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
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, element, adventure), dealDamage(targets, user, pendingDamage, false, element, adventure), generateModifierResultLines(addModifier([user], quicken)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Toxic Air Blade", "Unstoppable Air Blade")
	.setModifiers({ name: "Quicken", stacks: 1 })
	.setDurability(Infinity)
	.setDamage(20)
	.setHPCost(25);
