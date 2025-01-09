const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Balanced Daggers",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1Stacks}"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Fire",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [excellence, finesse] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user], excellence).concat(addModifier([user], finesse)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Finesse", stacks: 1 });
