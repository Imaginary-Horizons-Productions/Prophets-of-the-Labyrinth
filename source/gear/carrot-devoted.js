const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Carrot",
	[
		["use", "Grant an ally @{protection} protection and entice their pet to use its first move this turn"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target], protection);
		const resultLines = [`${target.name} gains protection.`];
		const ownerIndex = adventure.getCombatantIndex(target);
		const owner = target.team === "delver" ? target : adventure.getCombatant({ team: "delver", index: ownerIndex });
		if (owner.pet) {
			const petMoveTemplate = getPetMove(owner.pet, 0, getPlayer(owner.id, adventure.guildId).pets[owner.pet]);
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
	.setSidegrades("Balanced Carrot", "Reinforced Carrot")
	.setCooldown(1)
	.setProtection(50);
