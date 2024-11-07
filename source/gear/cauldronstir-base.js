const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

const gearName = "Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	200,
	(targets, user, adventure) => {
		const { element, damage } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir", "Sabotaging Cauldron Stir")
	.setDurability(15)
	.setDamage(40)
	.setRnConfig({ potions: 1 });
