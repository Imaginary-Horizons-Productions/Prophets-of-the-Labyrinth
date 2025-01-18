const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, combineModifierReceipts, addModifier, getCombatantCounters, generateModifierResultLines } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Innovative Cauldron Stir";
module.exports = new GearTemplate(variantName,
	[
		["use", "Strike a foe for <@{damage}> @{element} damage, grant all allies @{mod0Stacks} @{mod0} if Essence Countering"],
		["Critical💥", "Damage x @{critBonus}, add @{potionCount} random potion to loot"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { element, scalings: { damage, critBonus, potionCount }, modifiers: [empowerment] } = module.exports;
	const resultLines = [];
	if (getCombatantCounters(targets[0]).includes(this.essence)) {
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, empowerment))));
	}
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
		const rolledPotion = rollablePotions[user.roundRns[`${variantName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
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
	.setModifiers({ name: "Empowerment", stacks: 10 });
