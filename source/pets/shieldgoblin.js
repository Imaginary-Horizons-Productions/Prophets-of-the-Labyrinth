const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate } = require("../classes");
const { getEmoji } = require("../util/essenceUtil");
const { dealDamage, changeStagger } = require("../util/combatantUtil");

const petName = "Shield Goblin";
module.exports = new PetTemplate(petName, Colors.Green,
	[
		[
			new PetMoveTemplate("Prospect", "Find a random amount between 0-5g for the party", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					adventure.gainGold(petRNs.extras[0]);
					return [`${owner.name}'s Shield Goblin finds ${petRNs.extras[0]}g for the party.`];
				}).setRnConfig([11]),
			new PetMoveTemplate("Prospect+", "Find a random amount between 0-10g for the party", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					adventure.gainGold(petRNs.extras[0]);
					return [`${owner.name}'s Shield Goblin finds ${petRNs.extras[0]}g for the party.`];
				}).setRnConfig([21])
		],
		[
			new PetMoveTemplate("Shield Tackle", `Deal owner's protection in ${getEmoji("Earth")} damage to a random foe`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					return dealDamage(targets, owner, owner.protection, false, "Earth", adventure).resultLines;
				}).setRnConfig(["enemyIndex"]),
			new PetMoveTemplate("Shield Avalanche", `Deal owner's protection in ${getEmoji("Earth")} damage and 1 Stagger to a random foe`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					changeStagger(targets, null, 1);
					return dealDamage(targets, owner, owner.protection, false, "Earth", adventure).resultLines;
				}).setRnConfig(["enemyIndex"])
		]
	]
);
