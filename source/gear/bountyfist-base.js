const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

const gearName = "Bounty Fist";
module.exports = new GearTemplate(gearName,
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
		adventure.gold -= goldUsed;
		let pendingDamage = damage + user.getPower() + goldUsed;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(`${user.name}'s ${gearName} consumed ${goldUsed}g.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Midas's Bounty Fist", "Thirsting Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setDamage(40);
