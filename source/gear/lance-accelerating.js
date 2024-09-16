const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Accelerating Lance",
	[
		["use", "Strike a foe for @{damage} @{element} damage (double increase from @{mod1}), then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedQuicken = addModifier([user], quicken).length > 0;
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${addedQuicken ? ` ${getNames([user], adventure)[0]} is Quickened.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Shattering Lance", "Unstoppable Lance")
	.setModifiers({ name: "Quicken", stacks: 1 }, { name: "Power Up", stacks: 0 })
	.setDurability(15)
	.setDamage(40);
