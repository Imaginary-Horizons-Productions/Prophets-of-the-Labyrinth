const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const gearName = "Incompatible Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict <@{damage}> @{element} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { element, scalings: { damage, critBonus, potionCount }, modifiers: [incompatible] } = module.exports;
	const resultLines = generateModifierResultLines(addModifier(targets, incompatible));
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, element, adventure));
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines;
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Incompatibility", stacks: 3 });
