const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const gearName = "Toxic Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}, add @{bonus} random potion to loot"]
	],
	"Action",
	"Light",
	0,
	(targets, user, adventure) => {
		const { element, critMultiplier, bonus, modifiers: [poison] } = module.exports;
		const resultLines = [];
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", bonus);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, element, adventure));
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, poison)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1)
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Poison", stacks: 3 });
