const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Toxic Cauldron Stir";
module.exports = new GearTemplate(variantName,
	[
		["use", "Inflict <@{damage}> @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { element, scalings: { damage, critBonus, potionCount }, modifiers: [poison] } = module.exports;
	const resultLines = [];
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${variantName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, element, adventure);
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(resultLines, generateModifierResultLines(addModifier(survivors, poison)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Poison", stacks: 3 });
