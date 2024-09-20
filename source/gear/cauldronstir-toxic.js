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
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{damage} @{element} damage to a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [poison] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			resultLines.push(`${getNames([user], adventure)[0]} sets a batch of ${rolledPotion} to simmer.`);
		}
		const poisonedTargets = addModifier(targets, poison);
		if (poisonedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, getNames(poisonedTargets, adventure), "is", "are", "Poisoned."));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Corrosive Cauldron Stir", "Sabotaging Cauldron Stir")
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 4 })
	.setDamage(40);
