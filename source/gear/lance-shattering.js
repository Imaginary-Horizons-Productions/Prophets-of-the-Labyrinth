const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Shattering Lance",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{damage} @{element} damage (double increase from @{mod1}) to a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [frail], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const frailedTargets = addModifier(targets, frail);
		if (frailedTargets.length > 0) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(frailedTargets), "becomes", "become", "Frail.")}`;
		} else {
			return dealDamage(targets, user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Unstoppable Lance")
	.setModifiers({ name: "Frail", stacks: 4 }, { name: "Power Up", stacks: 0 })
	.setDurability(15)
	.setDamage(40);
