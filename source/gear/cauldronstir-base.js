const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

const rollablePotions = [
	"Protection Potion",
	"Clear Potion",
	"Earthen Potion",
	"Explosive Potion",
	"Fiery Potion",
	"Glowing Potion",
	"Health Potion",
	"Inky Potion",
	"Watery Potion",
	"Windy Potion"
];

module.exports = new GearTemplate("Cauldron Stir",
	"Strike a foe for @{damage} @{element} damage",
	"Add a random potion to loot",
	"Weapon",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.addResource(rolledPotion, "item", "loot", 1);
			return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} sets a batch of ${rolledPotion} to simmer.`;
		} else {
			return dealDamage([target], user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Toxic Cauldron Stir")
	.setDurability(15)
	.setDamage(40);
