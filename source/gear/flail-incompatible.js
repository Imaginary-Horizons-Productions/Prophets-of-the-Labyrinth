const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Incompatible Flail",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, stagger, modifiers: [torpidity] } = module.exports;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure)
			.concat(
				joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."),
				generateModifierResultLines(addModifier(targets, torpidity))
			);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Slowing Flail")
	.setCooldown(1)
	.setDamage(40)
	.setStagger(2)
	.setModifiers({ name: "Incompatibility", stacks: 2 });
