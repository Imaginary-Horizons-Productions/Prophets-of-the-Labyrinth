const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, payHP, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Toxic Air Blades",
	[
		["use", "Inflict @{damage} @{element} damage twice and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, pactCost: [pactCostValue], damage, critMultiplier, modifiers: [poison] } = module.exports;
		const resultLines = [payHP(user, pactCostValue, adventure)];
		if (adventure.lives < 1) {
			return resultLines;
		}
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, element, adventure), dealDamage(targets, user, pendingDamage, false, element, adventure), generateModifierResultLines(addModifier(targets, poison)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Adventurer's Air Blade", "Unstoppable Air Blade")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDamage(20)
	.setPactCost([25, "@{pactCost} HP"]);
