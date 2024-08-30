const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Power from Wrath",
	"Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing hp)",
	"Damage x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, hpCost } = module.exports;
		const paymentSentence = payHP(user, hpCost, adventure);
		const furiousness = (user.getMaxHP() - user.hp) / user.getMaxHP() + 1;
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= 2;
		}
		return `${paymentSentence}${dealDamage(targets, user, pendingDamage, false, element, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "enemy", needsLivingTargets: true })
	.setSidegrades("Bashing Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40)
	.setStagger(2);
