const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Unstoppable Air Blades",
	[
		["use", "Strike a foe for @{damage} @{essence} unblockable damage, even while Stunned"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
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
		return resultLines.concat(dealDamage(targets, user, pendingDamage, true, essence, adventure), dealDamage(targets, user, pendingDamage, true, essence, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Adventurer's Air Blades", "Toxic Air Blades")
	.setDamage(20)
	.setPactCost([25, "@{pactCost} HP"])
	.setCooldown(0);
