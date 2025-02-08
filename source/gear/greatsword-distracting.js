const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Distracting Greatsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe and their adjacent allies"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(survivors, distraction))));
	}, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Chaining Greatsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 2 });
