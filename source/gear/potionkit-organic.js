const { GearTemplate } = require('../classes');
const { listifyEN } = require('../util/textUtil');

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


module.exports = new GearTemplate("Organic Potion Kit",
	"Add @{bonus} random potion to loot, regain 1 durability when entering a new room",
	"Potion count x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, critMultiplier } = module.exports;
		let pendingPotionCount = bonus;
		if (isCrit) {
			pendingPotionCount *= critMultiplier;
		}
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		adventure.addResource(randomPotion, "item", "loot", pendingPotionCount);
		if (isCrit) {
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Reinforced Potion Kit", "Urgent Potion Kit")
	.setBonus(1) // Potion count
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: listifyEN(rollablePotions) });
