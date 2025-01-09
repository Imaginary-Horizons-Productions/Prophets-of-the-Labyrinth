const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { dealDamage, changeStagger, combineModifierReceipts, addModifier, getCombatantCounters, generateModifierResultLines } = require('../util/combatantUtil');

const gearName = "Innovative Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{element} damage, grant all allies @{mod0Stacks} @{mod0} if Essence Countering"],
		["Critical💥", "Damage x @{critMultiplier}, add @{bonus} random potion to loot"]
	],
	"Action",
	"Light",
	0,
	(targets, user, adventure) => {
		const { element, critMultiplier, bonus, modifiers: [empowerment] } = module.exports;
		const resultLines = [];
		if (getCombatantCounters(targets[0]).includes(this.essence)) {
			const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(userTeam, empowerment))));
		}
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", bonus);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, element, adventure));
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1)
	.setRnConfig({ potions: 1 })
	.setModifiers({ name: "Empowerment", stacks: 10 });
