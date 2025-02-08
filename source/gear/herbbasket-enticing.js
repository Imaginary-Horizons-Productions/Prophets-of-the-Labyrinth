const { GearTemplate, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { rollableHerbs } = require('../shared/herbs');
const { changeStagger } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Enticing Herb Basket",
	[
		["use", "Entice an ally's pet to use their first move and add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { scalings: { herbCount, critBonus }, essence } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const randomHerb = rollableHerbs[user.roundRns[`${gearName}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		const resultLines = [];
		if (user.crit) {
			adventure.room.addResource(randomHerb, "Item", "loot", herbCount * critBonus);
			resultLines.push(`${user.name} gathers a double-batch of ${randomHerb}.`);
		} else {
			adventure.room.addResource(randomHerb, "Item", "loot", herbCount);
			resultLines.push(`${user.name} gathers a batch of ${randomHerb}.`);
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
	}, { type: "single", team: "ally" })
	.setSidegrades("Guarding Herb Basket")
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
