const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Lightning Staff",
	[
		["use", `Strike ${bounceCount} random foes for <@{damage}> @{essence} damage`],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setUpgrades("Disenchanting Lightning Staff", "Hexing Lightning Staff")
	.setCooldown(2)
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2
	})
	.setRnConfig({ foes: 3 });
