const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Enticing Forbidden Knowledge",
	[
		["use", "Grant a single ally @{bonus} extra level up after combat and entice their pet to use its first move"],
		["Critical💥", "Reduce your target's cooldowns by @{bonus2}"]
	],
	"Pact",
	"Light",
	350,
	([target], user, adventure) => {
		const { essence, pactCost } = module.exports;
		if (user.team === "delver") {
			if (adventure.room.morale < pactCost[0]) {
				return ["...but the party didn't have enough morale to pull it off."];
			}
			adventure.room.morale -= pactCost[0];
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", 1);
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
					gear.cooldown -= bonus;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name}'s cooldowns were hastened.`);
			}
		}
		const ownerIndex = adventure.getCombatantIndex(target);
		const owner = target.team === "delver" ? target : adventure.getCombatant({ team: "delver", index: ownerIndex });
		if (owner.pet?.type) {
			const petMoveTemplate = getPetMove(owner.pet, 0);
			const petRNs = { delverIndex: ownerIndex, moveIndex: 0, targetReferences: [], extras: [] };
			petMoveTemplate.rnConfig.forEach(rnType => {
				switch (rnType) {
					case "enemyIndex":
						const livingEnemyIndices = [];
						for (let i = 0; i < adventure.room.enemies.length; i++) {
							if (adventure.room.enemies[i].hp > 0) {
								livingEnemyIndices.push(i);
							}
						}
						petRNs.targetReferences.push(new CombatantReference(owner.team === "delver" ? "enemy" : "delver", livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "battle")]));
						break;
					default:
						petRNs.extras.push(adventure.generateRandomNumber(rnType, "battle"));
				}
			})
			resultLines.push(`${target.name}'s ${owner.pet} uses ${petMoveTemplate.name}`, ...petMoveTemplate.effect(petMoveTemplate.selector(owner, petRNs).map(reference => adventure.getCombatant(reference)), owner, adventure, petRNs));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setBonus(1) // Level-Ups
	.setBonus2(1); // Cooldown Reduction
