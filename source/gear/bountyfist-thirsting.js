const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, gainHealth } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Thirsting Bounty Fist";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage} + gold paid> @{essence} damage to a foe, regain <@{healing}> if foe is downed"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, healing }, pactCost } = module.exports;
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
		if (survivors.length < targets.length) {
			const pendingHealing = healing.calculate(user);
			gainHealth(user, pendingHealing, adventure);
			resultLines.push(`${user.name} regains ${pendingHealing} HP.`);
		}
		return resultLines.concat(`${user.name}'s ${variantName} consumed ${goldUsed}g.`);
	}, { type: "single", team: "foe" })
	.setSidegrades("Midas's Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		healing: { description: "10% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 10) }
	});
