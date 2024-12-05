const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines, getCombatantWeaknesses } = require('../util/combatantUtil');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { getResistances, elementsList } = require('../util/elementUtil');

const gearName = "Sabotaging Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} stacks of a random weakness on a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, modifiers: [weakness] } = module.exports;
		const pendingDamage = damage + user.getPower();
		const resultLines = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.element === element) {
			changeStagger(stillLivingTargets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		for (const target of stillLivingTargets) {
			const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
			const weaknessPool = elementsList(ineligibleWeaknesses);
			if (weaknessPool.length > 0) {
				const pendingWeakness = `${weaknessPool[user.roundRns[`${gearName}${SAFE_DELIMITER}weaknesses`][0] % weaknessPool.length]} Weakness`;
				resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, { name: pendingWeakness, stacks: weakness.stacks })));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setModifiers({ name: "unparsed random weakness", stacks: 2 })
	.setSidegrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir")
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ potions: 1, weaknesses: 1 });
