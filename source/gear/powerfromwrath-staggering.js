const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Staggering Power from Wrath",
	[
		["use", "Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing HP)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { element, damage, hpCost, stagger } = module.exports;
		const resultLines = [payHP(user, hpCost, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage) * furiousness;
			if (user.crit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, element, adventure));
			const stillLivingTargets = targets.filter(target => target.hp > 0);
			if (stillLivingTargets.length > 0) {
				if (user.element === element) {
					changeStagger(stillLivingTargets, "elementMatchFoe");
				}
				changeStagger(stillLivingTargets, stagger);
				resultLines.push(joinAsStatement(false, stillLivingTargets.map(target => target.name), "was", "were", "Staggered."));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Bashing Power from Wrath", "Hunter's Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40)
	.setStagger(2);
