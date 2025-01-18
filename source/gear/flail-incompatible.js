const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Incompatible Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, stagger, modifiers: [torpidity] } = module.exports;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure)
			.concat(
				joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."),
				generateModifierResultLines(addModifier(targets, torpidity))
			);
	}, { type: "single", team: "foe" })
	.setSidegrades("Slowing Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setStagger(2)
	.setModifiers({ name: "Incompatibility", stacks: 2 });
