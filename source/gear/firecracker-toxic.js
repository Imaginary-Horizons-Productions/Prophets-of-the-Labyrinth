const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN, joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Toxic Firecracker",
	"Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const poisonedTargetNames = getNames(addModifier(targets, poison), adventure);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, poisonedTargetNames, "is", "are", "Poisoned.")}`;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Mercurial Firecracker")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(15);
