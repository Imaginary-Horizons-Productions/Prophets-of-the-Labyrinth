const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil');
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


module.exports = new GearTemplate("Reinforced Potion Kit",
	"Gain @{block} block and add @{bonus} random potion to loot",
	"Potion count x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, block, critMultiplier } = module.exports;
		let pendingPotionCount = bonus;
		if (isCrit) {
			pendingPotionCount *= critMultiplier;
		}
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		addBlock(user, block);
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		adventure.addResource(randomPotion, "item", "loot", pendingPotionCount);
		if (isCrit) {
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a double-batch of ${randomPotion} simmering.`;
		} else {
			return `${user.getName(adventure.room.enemyIdMap)} prepares to Block and sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Organic Potion Kit", "Urgent Potion Kit")
	.setBonus(1) // Potion count
	.setBlock(75)
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: listifyEN(rollablePotions) });
