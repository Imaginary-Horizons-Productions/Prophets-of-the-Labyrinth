const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Incompatible Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, stagger, modifiers: [torpidity] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (survivors.length > 0) {
			changeStagger(survivors, user, pendingStagger);
			resultLines.push(joinAsStatement(false, survivors.map(target => target.name), "is", "are", "Staggered."));
		}
		return resultLines.concat(generateModifierResultLines(addModifier(survivors, torpidity)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Slowing Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setStagger(2)
	.setModifiers({ name: "Incompatibility", stacks: 2 });
