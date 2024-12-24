const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

const gearName = "Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{essence} damage"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, damage } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, essence, adventure)];
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir", "Sabotaging Cauldron Stir")
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ potions: 1 });
