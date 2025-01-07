const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

const gearName = "Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Damage x @{critMultiplier}, add @{bonus} random potion to loot"]
	],
	"Action",
	"Light",
	0,
	(targets, user, adventure) => {
		const { element, critMultiplier, bonus } = module.exports;
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
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1)
	.setRnConfig({ potions: 1 });
