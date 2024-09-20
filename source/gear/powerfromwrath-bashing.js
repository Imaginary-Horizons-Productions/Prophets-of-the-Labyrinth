const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bashing Power from Wrath",
	[
		["use", "Pay @{hpCost} to strike a foe for @{damage} @{element} (+protection) damage (greatly increases with your missing HP)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, hpCost } = module.exports;
		const resultLines = [payHP(user, hpCost, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage + user.protection) * furiousness;
			if (user.element === element) {
				changeStagger(targets, "elementMatchFoe");
			}
			if (isCrit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, element, adventure));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Power from Wrath", "Staggering Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40);
