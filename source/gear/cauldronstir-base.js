const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Cauldron Stir";
module.exports = new GearTemplate(variantName,
	[
		["use", "Strike a foe for <@{damage}> @{essence} damage"],
		["Critical💥", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, potionCount } } = module.exports;
	const resultLines = [];
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${variantName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
		adventure.room.addResource(rolledPotion, "Item", "loot", potionCount);
		resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines);
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		potionCount: 1
	})
	.setRnConfig({ potions: 1 });
