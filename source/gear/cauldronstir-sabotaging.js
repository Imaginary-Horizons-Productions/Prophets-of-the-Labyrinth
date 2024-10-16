const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

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

module.exports = new GearTemplate("Sabotaging Cauldron Stir",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} stacks of a random weakness on a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [weakness] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		for (const target of targets) {
			const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
			const weaknessPool = elementsList(ineligibleWeaknesses);
			if (weaknessPool.length > 0) {
				resultLines.push(...generateModifierResultLines(addModifier(targets, { name: `${weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "battle")]} Weakness`, stacks: weakness.stacks })));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "unparsed random weakness", stacks: 2 })
	.setSidegrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir")
	.setDurability(15)
	.setDamage(40);
