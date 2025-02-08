const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const bounceCount = 3;
module.exports = new GearTemplate("Bouncing Flourish",
	[
		["use", `Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on ${bounceCount} random foes`],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, distraction)));
}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ foes: bounceCount })
	.setModifiers({ name: "Distraction", stacks: 3 });
