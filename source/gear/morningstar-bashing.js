const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Bashing Morning Star",
	"Strike a foe for @{damage} (+protection) @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + user.protection;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, stagger);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(targets), "was", "were", "Staggered.")}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Awesome Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);
