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

module.exports = new GearTemplate("Urgent Potion Kit",
	"Add @{bonus} random potion to loot with priority",
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
	.setSidegrades("Organic Potion Kit", "Reinforced Potion Kit")
	.setBonus(1) // Potion count
	.setPriority(1)
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: listifyEN(rollablePotions) });
