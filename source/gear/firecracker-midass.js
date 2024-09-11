const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Midas's Firecracker",
	[
		["use", "Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [curse], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const cursedTargetnames = getNames(addModifier(targets, curse), adventure);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, cursedTargetnames, "is", "are", "afflicted with Curse of Midas.")}`;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setDurability(15)
	.setDamage(5);
