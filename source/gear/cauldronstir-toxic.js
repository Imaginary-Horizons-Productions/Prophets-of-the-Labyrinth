const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

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
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [poison] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const poisonedTargets = addModifier(targets, poison);
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			if (poisonedTargets.length > 0) {
				return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(poisonedTargets, adventure), "is", "are", "Poisoned.")} ${getNames([user], adventure)[0]} sets a batch of ${rolledPotion} to simmer.`;
			} else {
				return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${getNames([user], adventure)[0]} sets a batch of ${rolledPotion} to simmer.`;
			}
		} else {
			if (poisonedTargets.length > 0) {
				return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(poisonedTargets, adventure), "is", "are", "Poisoned.")}`;
			} else {
				return dealDamage(targets, user, pendingDamage, false, element, adventure);
			}
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 4 })
	.setDamage(40);
