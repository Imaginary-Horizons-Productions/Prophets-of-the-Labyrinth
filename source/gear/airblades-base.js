const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Air Blades",
	[
		["use", "Strike a foe for @{damage} @{essence} damage twice"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { essence, pactCost: [pactCostValue], damage, critMultiplier } = module.exports;
		const resultLines = [payHP(user, pactCostValue, adventure)];
		if (adventure.lives < 1) {
			return resultLines;
		}
		let pendingDamage = damage + user.getPower();
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return resultLines.concat(dealDamage(targets, user, pendingDamage, false, essence, adventure), dealDamage(targets, user, pendingDamage, false, essence, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Adventurer's Air Blade", "Toxic Air Blade", "Unstoppable Air Blade")
	.setDamage(20)
	.setPactCost([25, "@{pactCost} HP"]);
