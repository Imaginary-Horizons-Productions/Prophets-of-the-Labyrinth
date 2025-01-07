const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Attuned Daggers",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1Stacks}"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Fire",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [excellence, attunement] } = module.exports;
		let pendingDamge = user.getPower();
		if (user.crit) {
			pendingDamge *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamge, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user], excellence).concat(addModifier([user], attunement))) ));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 });
