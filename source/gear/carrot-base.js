const { GearTemplate, CombatantReference } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Carrot",
	[
		["use", "Gain @{protection} protection and entice an ally's pet to use its first move this turn"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	200,
	([target], user, adventure) => {
		const { element, protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], protection);
		const resultLines = [`${user.name} gains protection.`];
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
	.setUpgrades("Devoted Carrot", "Lucky Carrot", "Reinforced Carrot")
	.setCooldown(1)
	.setProtection(50);
