const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vigorous Warhammer",
	[
		["use", "Deal <@{damage} + @{bonus} if target is Stunned> @{essence} damage to a single foe and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [impact] } = module.exports;
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
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([user], impact)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Fatiguing Warhammer")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75) // Reactive Damage
	.setModifiers({ name: "Impact", stacks: 2 });
