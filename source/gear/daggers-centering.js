const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Centering Daggers",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe, gain @{mod0Stacks} @{mod0}, and shrug off @{bonus*-1} Stagger"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Fire",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [excellence], bonus } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		changeStagger([user], user, bonus);
		return resultLines.concat(generateModifierResultLines(addModifier([user], excellence)), `${user.name} shrugs off some Stagger.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Excellence", stacks: 2 })
	.setBonus(-2);
