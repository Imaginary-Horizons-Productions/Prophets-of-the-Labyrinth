const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Flanking Shortsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe and gain @{mod0Stacks} @{mod0}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect(
	(targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [finesse, exposure] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier(survivors, exposure))));
	}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Exposure", stacks: 2 });
