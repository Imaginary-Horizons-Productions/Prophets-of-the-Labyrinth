const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Unstoppable Air Blades",
	[
		["use", "Pay @{hpCost} HP, then strike a foe for @{damage} @{element} unblockable damage, even while Stunned"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, hpCost, damage, critMultiplier } = module.exports;
		const resultLines = [payHP(user, hpCost, adventure)];
		if (adventure.lives < 1) {
			return resultLines;
		}
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, true, element, adventure), dealDamage(targets, user, pendingDamage, true, element, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Adventurer's Air Blades", "Toxic Air Blades")
	.setDamage(20)
	.setHPCost(25);
