const { GearTemplate } = require('../classes');

const rollablePotions = [
	"Block Potion",
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

module.exports = new GearTemplate("Potion Kit",
	"Add 1 random potion to loot",
	"Instead add @{critMultiplier} potions",
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, critMultiplier } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		if (isCrit) {
			adventure.addResource(randomPotion, "item", "loot", critMultiplier);
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(randomPotion, "item", "loot", 1);
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Organic Potion Kit", "Reinforced Potion Kit", "Urgent Potion Kit")
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
