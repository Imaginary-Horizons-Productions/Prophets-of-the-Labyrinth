const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Bounty Fist";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus } } = module.exports;
		const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
		adventure.gold -= goldUsed;
		let pendingDamage = damage.calculate(user) + goldUsed;
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(`${user.name}'s ${variantName} consumed ${goldUsed}g.`);
	}, { type: "single", team: "foe" })
	.setUpgrades("Midas's Bounty Fist", "Thirsting Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});
