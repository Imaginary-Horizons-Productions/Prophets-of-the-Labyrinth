const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Spear",
	"Strike all foes for @{damage} @{element} damage",
	"Also inflict @{foeStagger}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const critTargets = [];
		targets.map(target => {
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
			if (isCrit) {
				target.addStagger(stagger);
				critTargets.push(target.getName(adventure.room.enemyIdMap));
			}
		})
		if (critTargets.length > 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${listifyEN(critTargets, false)} were Staggered.`;
		} else if (critTargets.length === 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${critTargets[0]} was Staggered.`;
		} else {
			return dealDamage(targets, user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Spear", "Reactive Spear")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40);
