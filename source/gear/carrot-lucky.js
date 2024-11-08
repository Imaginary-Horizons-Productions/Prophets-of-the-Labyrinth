const { GearTemplate } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lucky Carrot",
	[
		["use", "Gain @{protection} protection and @{mod0Stacks} @{mod0}, then entice an ally's pet to use its first move this turn"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, protection, critMultiplier, modifiers: [lucky] } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target], "elementMatchAlly");
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], protection);
		const resultLines = [`${user.name} gains protection.`, ...generateModifierResultLines(addModifier([user], lucky))];
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
	.setSidegrades("Devoted Carrot", "Reinforced Carrot")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(15)
	.setProtection(50);
