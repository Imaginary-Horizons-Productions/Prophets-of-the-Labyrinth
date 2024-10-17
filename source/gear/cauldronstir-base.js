const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cauldron Stir",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (isCrit) {
			const rolledPotion = rollablePotions[user.roundRns[`Cauldron Stir${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir", "Sabotaging Cauldron Stir")
	.setDurability(15)
	.setDamage(40)
	.setRnConfig({ potions: 1 });
