const { GearTemplate } = require("../classes");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, getCombatantCounters } = require("../util/combatantUtil");
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');

const gearName = "Duelist's Pistol";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if only attacker> @{essence} damage, give a random ally <@{mod0Stacks} ÷ target's Vulnerability debuffs> @{mod0} if the foe is weak to @{essence}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Unaligned",
	350,
	([target], user, adventure) => {
		const { damage, bonus, critMultiplier, essence, modifiers: [empowerment] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const targetIndex = adventure.getCombatantIndex(target);
		const userIndex = adventure.getCombatantIndex(user);
		// Duelist's check
		if (!adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === target.team && moveTarget.index === targetIndex))) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (getCombatantCounters(target).includes(essence)) {
			const inducedVulnerabilityCount = Object.keys(target.modifiers).filter(modifier => modifier.endsWith("Vulnerability")).length;
			const pendingEmpowerment = { name: "Empowerment", stacks: Math.floor(empowerment.stacks / inducedVulnerabilityCount) };
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const selectedAllies = [];
			for (let i = 0; i < user.roundRns[`${gearName}${SAFE_DELIMITER}allies`].length; i++) {
				selectedAllies.push(allyTeam[user.roundRns[`${gearName}${SAFE_DELIMITER}allies`][i] % allyTeam.length]);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(selectedAllies, pendingEmpowerment))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Double Pistol", "Flanking Pistol")
	.setModifiers({ name: "Empowerment", stacks: 30 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75)
	.setRnConfig({ "allies": 1 });
