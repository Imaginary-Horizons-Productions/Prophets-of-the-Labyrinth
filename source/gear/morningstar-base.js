const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Morning Star",
	"Strike a foe applying @{foeStagger} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier } = module.exports;
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
	.setUpgrades("Awesome Morning Star", "Bashing Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);
