const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');
const { SAFE_DELIMITER } = require('../constants');
const { rollablePotions } = require('../shared/potions');

const gearName = "Toxic Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{damage} @{element} damage to a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, modifiers: [poison] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		return resultLines.concat(generateModifierResultLines(addModifier(targets, poison)));
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Corrosive Cauldron Stir", "Sabotaging Cauldron Stir")
	.setDurability(15)
	.setModifiers({ name: "Poison", stacks: 4 })
	.setDamage(40)
	.setRnConfig({ potions: 1 });
