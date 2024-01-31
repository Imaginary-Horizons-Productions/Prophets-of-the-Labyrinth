const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

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

module.exports = new GearTemplate("Toxic Cauldron Stir",
	"Apply @{mod0Stacks} @{mod0} and @{damage} @{element} damage to a foe",
	"Add a random potion to loot",
	"Weapon",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, damage, modifiers: [poison] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const addedPoison = addModifier(target, poison);
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.addResource(rolledPotion, "item", "loot", 1);
			if (addedPoison) {
				return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} was Poisoned. ${user.getName(adventure.room.enemyIdMap)} sets a batch of ${rolledPotion} to simmer.`;
			} else {
				return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} sets a batch of ${rolledPotion} to simmer.`;
			}
		} else {
			if (addedPoison) {
				return `${dealDamage([target], user, pendingDamage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} was Poisoned.`;
			} else {
				return dealDamage([target], user, pendingDamage, false, element, adventure);
			}
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 4 })
	.setDamage(40);
