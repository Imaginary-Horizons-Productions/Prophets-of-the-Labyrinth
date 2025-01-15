const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Carrot",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to an ally and entice their pet to use its first move"],
		["Critical💥", "@{mod0} + @{critMultiplier}"]
	],
	"Support",
	"Earth",
	200,
	([target], user, adventure) => {
		const { essence, modifiers: [regeneration], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingRegeneration = { name: regeneration.name, stacks: regeneration.stacks.generator(user) };
		if (user.crit) {
			pendingRegeneration += critMultiplier;
		}
		const resultLines = addModifier([target], pendingRegeneration);
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
			resultLines.push(`${target.name}'s ${owner.pet.type} uses ${petMoveTemplate.name}`, ...petMoveTemplate.effect(petMoveTemplate.selector(owner, petRNs).map(reference => adventure.getCombatant(reference)), owner, adventure, petRNs));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Guarding Carrot", "Balanced Carrot")
	.setCooldown(1)
	.setModifiers({ name: "Regeneration", stacks: { description: "2 + Bonus Speed ÷ 20", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 20) } })
	.setCritMultiplier(1);
