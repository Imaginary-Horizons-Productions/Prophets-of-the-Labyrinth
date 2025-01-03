const { GearTemplate } = require("../classes");
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');

const gearName = "Duelist's Pistol";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if only attacker> @{element} damage, give a random ally <@{mod0Stacks} ÷ target's Weakness debuffs> @{mod0} if the foe is weak to @{element}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
	350,
	([target], user, adventure) => {
		const { damage, bonus, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const targetIndex = adventure.getCombatantIndex(target);
		const userIndex = adventure.getCombatantIndex(user);
		// Duelist's check
		if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== targets[0].team || moveTarget.index !== targetIndex))) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (getCombatantWeaknesses(target).includes(element)) {
			const inducedWeaknessCount = Object.keys(target.modifiers).filter(modifier => modifier.endsWith("Weakness")).length;
			const pendingPowerUp = { name: "Power Up", stacks: Math.floor(powerUp.stacks / inducedWeaknessCount) };
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const selectedAllies = [];
			for (let i = 0; i < user.roundRns[`${gearName}${SAFE_DELIMITER}allies`].length; i++) {
				selectedAllies.push(allyTeam[user.roundRns[`${gearName}${SAFE_DELIMITER}allies`][i] % allyTeam.length]);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(selectedAllies, pendingPowerUp))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Double Pistol", "Flanking Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75)
	.setRnConfig({ "allies": 1 });
