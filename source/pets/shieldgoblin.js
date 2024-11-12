const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate, CombatantReference } = require("../classes");
const { getEmoji } = require("../util/elementUtil");
const { dealDamage, changeStagger } = require("../util/combatantUtil");

const petName = "Shield Goblin";
module.exports = new PetTemplate(petName, Colors.Green,
	[
		[
			new PetMoveTemplate("Prospect", "Find a random amount between 0-5g for the party", () => [],
				(targets, owner, adventure) => {
					adventure.gainGold(adventure.petRNs[1]);
					return [`${owner.name}'s Shield Goblin finds ${adventure.petRNs[1]}g for the party.`];
				}).setRnConfig([6]),
			new PetMoveTemplate("Prospect+", "Find a random amount between 0-10g for the party", () => [],
				(targets, owner, adventure) => {
					adventure.gainGold(adventure.petRNs[1]);
					return [`${owner.name}'s Shield Goblin finds ${adventure.petRNs[1]}g for the party.`];
				}).setRnConfig([11])
		],
		[
			new PetMoveTemplate("Shield Tackle", `Deal owner's protection in ${getEmoji("Earth")} damage to a random foe`, () => [],
				(targets, owner, adventure) => {
					if (owner.protection > 0) {
						return dealDamage(targets, owner, owner.protection, false, "Earth", adventure);
					} else {
						return [];
					}
				}).setRnConfig(["enemyIndex"]),
			new PetMoveTemplate("Shield Avalanche", `Deal owner's protection in ${getEmoji("Earth")} damage and 1 Stagger to a random foe`,
				(owner, adventure) => [new CombatantReference("enemy", adventure.petRNs[1])],
				(targets, owner, adventure) => {
					changeStagger(targets, 1);
					if (owner.protection > 0) {
						return dealDamage(targets, owner, owner.protection, false, "Earth", adventure);
					} else {
						return [];
					}
				}).setRnConfig(["enemyIndex"])
		]
	]
);
