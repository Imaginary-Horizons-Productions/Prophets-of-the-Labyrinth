const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');

const bounces = 3;
module.exports = new GearTemplate("Hexing Lightning Staff",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(addModifier(survivors, misfortune));
	}, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setSidegrades("Disenchanting Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3 })
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2,
		bounces
	})
	.setModifiers({ name: "Misfortune", stacks: 4 });
