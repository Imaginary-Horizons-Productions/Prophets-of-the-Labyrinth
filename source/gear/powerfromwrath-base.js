const { GearTemplate } = require('../classes');
const { payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Power from Wrath",
	"Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing hp)",
	"Damage x@{critMultiplier}",
	"Pact",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, hpCost } = module.exports;
		const furiousness = (user.getMaxHP() - user.hp) / user.getMaxHP() + 1;
		let pendingDamage = damage * furiousness;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= 2;
		}
		return `${payHP(user, hpCost, adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)}`;
	}
).setTargetingTags({ target: "single", team: "enemy", needsLivingTargets: true })
	.setDurability(15)
	.setHPCost(40)
	.setDamage(75);
