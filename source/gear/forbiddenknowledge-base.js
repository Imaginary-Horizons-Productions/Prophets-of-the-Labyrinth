const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Forbidden Knowledge",
	[
		["use", "Grant a single ally @{bonus} extra level up after combat"],
		["Critical💥", "Reduce your target's cooldowns by @{bonus2}"]
	],
	"Pact",
	"Light",
	200,
	([target], user, adventure) => {
		const { essence, pactCost } = module.exports;
		if (user.team === "delver") {
			if (adventure.room.morale < pactCost[0]) {
				return ["...but the party didn't have enough Morale to pull it off."];
			}
			adventure.room.morale -= pactCost[0];
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", 1);
		}
		const resultLines = [`${target.name} gains a level's worth of cursed knowledge. The party's Morale falls.`];
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= bonus;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name}'s cooldowns were hastened.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setPactCost([2, "Consume @{pactCost} Morale"])
	.setBonus(1) // Level-Ups
	.setBonus2(1); // Cooldown Reduction
