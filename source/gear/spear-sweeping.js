const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	"Strike all foes for @{damage} @{element} damage",
	"Also inflict @{stagger}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, stagger, damage } = module.exports;
		targets.map(target => {
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
			if (isCrit) {
				target.addStagger(stagger);
			}
		})
		return dealDamage(targets, user, damage, false, element, adventure);
	}
).setTargetingTags({ target: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(75);
