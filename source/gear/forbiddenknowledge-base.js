const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Forbidden Knowledge",
	[
		["use", "Grant an ally @{levelUps} extra level up after combat"],
		["Critical💥", "Reduce your target's cooldowns by @{cooldownReduction}"]
	],
	"Pact",
	"Light"
).setCost(200)
	.setEffect(([target], user, adventure) => {
		const { essence, pactCost, scalings: { levelUps, cooldownReduction } } = module.exports;
		if (user.team === "delver") {
			if (adventure.room.morale < pactCost[0]) {
				return ["...but the party didn't have enough morale to pull it off."];
			}
			adventure.room.morale -= pactCost[0];
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", levelUps);
		}
		const resultLines = [`${target.name} gains a level's worth of cursed knowledge. The party's morale falls.`];
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= cooldownReduction;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name}'s cooldowns were hastened.`);
			}
		}
		return resultLines;
	}, { type: "single", team: "ally" })
	.setUpgrades("Enticing Forbidden Knowledge", "Soothing Forbidden Knowledge")
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setScalings({
		levelUps: 1,
		cooldownReduction: 1
	});
