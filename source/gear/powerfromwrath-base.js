const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Power from Wrath",
	[
		["use", "Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing hp)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, hpCost } = module.exports;
		const paymentSentence = payHP(user, hpCost, adventure);
		const furiousness = 2 - user.hp / user.getMaxHP();
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= 2;
		}
		return `${paymentSentence}${dealDamage(targets, user, pendingDamage, false, element, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Bashing Power from Wrath", "Hunter's Power from Wrath", "Staggering Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40);
