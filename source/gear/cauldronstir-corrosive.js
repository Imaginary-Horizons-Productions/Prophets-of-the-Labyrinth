const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames, addModifier } = require('../util/combatantUtil');
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

module.exports = new GearTemplate("Corrosive Cauldron Stir",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [powerdown] } = module.exports;
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

		const poweredDownTargets = addModifier(targets, powerdown);
		if (poweredDownTargets.length > 0) {
			resultLines.push(joinAsStatement(false, getNames(poweredDownTargets, adventure), "is", "are", "Powered Down."));
		}

		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sabotaging Cauldron Stir", "Toxic Cauldron Stir")
	.setModifiers({ name: "Power Down", stacks: 10 })
	.setDurability(15)
	.setDamage(40);
