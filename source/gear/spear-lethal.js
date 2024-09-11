const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Lethal Spear",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}, inflict @{stagger} more Stagger"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
			changeStagger(targets, bonus);
		}
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${isCrit ? ` ${joinAsStatement(false, getNames(targets), "was", "were", "Staggered.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Spear", "Sweeping Spear")
	.setBonus(2) // Crit Stagger
	.setDurability(15)
	.setDamage(65);
