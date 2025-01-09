const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Toxic Warhammer",
	[
		["use", "Deal <@{damage} + @{bonus} if target is Stunned> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [poison] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (targets[0].isStunned) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, poison)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Fatiguing Warhammer")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75) // Reactive Damage
	.setModifiers({ name: "Poison", stacks: 3 });
