const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Staggering Strong Attack",
	"Strike a foe applying @{foeStagger} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { damage, element, stagger, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, stagger);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered.")}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Strong Attack")
	.setDurability(15)
	.setDamage(65)
	.setStagger(2);
