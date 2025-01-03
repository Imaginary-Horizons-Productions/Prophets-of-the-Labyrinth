const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, gainHealth } = require('../util/combatantUtil');

const gearName = "Thirsting Bounty Fist";
module.exports = new GearTemplate(gearName,
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a single foe, regain @{healing} HP if they're downed"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, healing, pactCost } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
		adventure.gold -= goldUsed;
		let pendingDamage = damage + user.getPower() + goldUsed;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			gainHealth(user, healing, adventure);
			resultLines.push(`${user.name} regains ${healing} HP.`);
		}

		return resultLines.concat(`${user.name}'s ${gearName} consumed ${goldUsed}g.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Midas's Bounty Fist", "Thirsting Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setDamage(40)
	.setHealing(25);
