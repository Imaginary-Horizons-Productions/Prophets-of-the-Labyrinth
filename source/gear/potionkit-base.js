const { GearTemplate } = require('../classes');
const { removeModifier } = require('../util/combatantUtil');

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
	"Instead add @{critBonus} potions",
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		const randomPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
		if (isCrit) {
			adventure.addResource(randomPotion, "item", "loot", critBonus);
			return `${user.getName(adventure.room.enemyIdMap)} sets a double-batch of ${randomPotion} simmering.`;
		} else {
			adventure.addResource(randomPotion, "item", "loot", 1);
			return `${user.getName(adventure.room.enemyIdMap)} sets a batch of ${randomPotion} simmering.`;
		}
	}
).setTargetingTags({ target: "none", team: "none" })
	.setUpgrades("Organic Potion Kit", "Reinforced Potion Kit", "Urgent Potion Kit")
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setFlavorText({ name: "Possible Potions", value: rollablePotions.join(", ") });
