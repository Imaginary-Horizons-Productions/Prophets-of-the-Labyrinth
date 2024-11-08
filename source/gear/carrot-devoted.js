const { GearTemplate } = require('../classes');
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
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target], "elementMatchAlly");
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target], protection);
		const resultLines = [`${target.name} gains protection.`];
		const owner = target.team === "delver" ? target : adventure.getCombatant({ team: "delver", index: adventure.getCombatantIndex(target) });
		if (owner.pet) {
			const petRNs = [0];
			const petMoveTemplate = getPetMove(owner.pet, petRNs, getPlayer(owner.id, adventure.guildId).pets[owner.pet]);
			petMoveTemplate.rnConfig.forEach(rnType => {
				switch (rnType) {
					case "enemyIndex":
						const livingEnemyIndices = [];
						for (let i = 0; i < adventure.room.enemies.length; i++) {
							if (adventure.room.enemies[i].hp > 0) {
								livingEnemyIndices.push(i);
							}
						}
						petRNs.push(livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "battle")]);
						break;
					default:
						petRNs.push(adventure.generateRandomNumber(rnType, "battle"));
				}
			})
			resultLines.push(`${target.name}'s ${owner.pet} uses ${petMoveTemplate.name}`, ...petMoveTemplate.effect(petMoveTemplate.selector(owner, adventure).map(reference => adventure.getCombatant(reference)), owner, { petRNs, room: adventure.room }));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Lucky Carrot", "Reinforced Carrot")
	.setDurability(15)
	.setProtection(50);
