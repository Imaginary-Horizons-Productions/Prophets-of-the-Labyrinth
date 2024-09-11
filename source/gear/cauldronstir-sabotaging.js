const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames, addModifier } = require('../util/combatantUtil');

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
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (isCrit) {
			const rolledPotion = rollablePotions[adventure.generateRandomNumber(rollablePotions.length, "battle")];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			resultSentences.push(`${getNames([user], adventure)[0]} sets a batch of ${rolledPotion} to simmer.`);
		}
		const targetNames = getNames(targets, adventure);
		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
			const weaknessPool = elementsList(ineligibleWeaknesses);
			if (weaknessPool.length > 0) {
				const addedWeakness = addModifier(targets, { name: `${weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "battle")]} Weakness`, stacks: weakness.stacks }).length > 0;
				if (addedWeakness) {
					resultSentences.push(`${targetNames[i]} gains ${pendingWeakness.name}`);
				}
			}
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "unparsed random weakness", stacks: 2 })
	.setSidegrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir")
	.setDurability(15)
	.setDamage(40);
