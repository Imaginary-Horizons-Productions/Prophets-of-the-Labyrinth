const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

const gearName = "Corrosive Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, modifiers: [powerdown] } = module.exports;
		const pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}

		return resultLines.concat(generateModifierResultLines(addModifier(targets, powerdown)));
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sabotaging Cauldron Stir", "Toxic Cauldron Stir")
	.setModifiers({ name: "Power Down", stacks: 10 })
	.setDurability(15)
	.setDamage(40)
	.setRnConfig({ potions: 1 });
