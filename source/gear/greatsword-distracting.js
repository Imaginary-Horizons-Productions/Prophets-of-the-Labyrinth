const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Distracting Greatsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe and their adjacent allies"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, distraction))));
	}, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Chaining Greatsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 2 });
