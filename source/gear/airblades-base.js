const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, payHP, dealDamage } = require('../util/combatantUtil');
const { unbreakablePassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Air Blades",
	[
		unbreakablePassive,
		["use", "Pay @{hpCost} HP, then strike a foe for @{damage} @{element} damage twice"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	200,
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
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, element, adventure), dealDamage(targets, user, pendingDamage, false, element, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Accelerating Air Blade", "Toxic Air Blade", "Unstoppable Air Blade")
	.setDurability(Infinity)
	.setDamage(20)
	.setHPCost(25);
