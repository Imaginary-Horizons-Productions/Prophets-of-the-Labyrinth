const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Thief's Stick",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a single foe, gain @{bonus}g if they're downed"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Earth",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [impotence], bonus } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		if (stillLivingTargets.length < targets.length) {
			adventure.room.addResource("Gold", "Currency", "loot", bonus);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, impotence))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Impotence", stacks: 3 })
	.setBonus(30);
