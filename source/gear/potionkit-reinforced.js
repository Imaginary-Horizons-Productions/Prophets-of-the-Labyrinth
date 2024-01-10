const { GearTemplate } = require('../classes');
const { listifyEN } = require('../util/textUtil');

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


module.exports = new GearTemplate("Reinforced Potion Kit",
	"Gain @{protection} protection and add @{bonus} random potion to loot",
	"Potion count x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, protection, critMultiplier } = module.exports;
		let pendingPotionCount = bonus;
		if (isCrit) {
			pendingPotionCount *= critMultiplier;
		}
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		user.protection += protection;
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		adventure.addResource(randomPotion, "item", "loot", pendingPotionCount);
		if (isCrit) {
			return `${user.getName(adventure.room.enemyIdMap)} gains protection and sets a double-batch of ${randomPotion} simmering.`;
		} else {
			return `${user.getName(adventure.room.enemyIdMap)} gains protection and sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Organic Potion Kit", "Urgent Potion Kit")
	.setBonus(1) // Potion count
	.setProtection(75)
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: listifyEN(rollablePotions) });
