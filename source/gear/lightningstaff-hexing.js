const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Hexing Lightning Staff",
	[
		["use", `Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(addModifier(targets, misfortune));
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Disenchanting Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3 })
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2
	})
	.setModifiers({ name: "Misfortune", stacks: 4 });
