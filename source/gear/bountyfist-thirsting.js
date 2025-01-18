const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, gainHealth } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const gearName = "Thirsting Bounty Fist";
module.exports = new GearTemplate(gearName,
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a single foe, regain <@{healing}> if foe is downed"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, healing }, pactCost } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
		adventure.gold -= goldUsed;
		let pendingDamage = damage.calculate(user) + goldUsed;
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			const pendingHealing = healing.calculate(user);
			gainHealth(user, pendingHealing, adventure);
			resultLines.push(`${user.name} regains ${pendingHealing} HP.`);
		}

		return resultLines.concat(`${user.name}'s ${gearName} consumed ${goldUsed}g.`);
	}, { type: "single", team: "foe" })
	.setSidegrades("Midas's Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		healing: { description: "10% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 10) }
	});
