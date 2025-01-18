const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Soothing Forbidden Knowledge",
	[
		["use", "Grant a single ally <@{mod0Stacks}> @{mod0} and @{levelUps} extra level up after combat"],
		["Critical💥", "Reduce your target's cooldowns by @{cooldownReduction}"]
	],
	"Pact",
	"Light"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, pactCost, modifiers: [regeneration], scalings: { levelUps, cooldownReduction } } = module.exports;
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
		resultLines.push(...generateModifierResultLines(addModifier([target], { name: regeneration.name, stacks: regeneration.stacks.calculate(user) })));
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
	.setSidegrades("Enticing Forbidden Knowledge")
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setScalings({
		levelUps: 1,
		cooldownReduction: 1
	})
	.setModifiers({ name: "Regeneration", stacks: { description: "2 + 5% Bonus Speed", calculate: (user) => 2 + Math.floor(user.getBonusSpeed() / 20) } })
