const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate } = require("../classes");

const petName = "";
module.exports = new PetTemplate(petName, Colors.Blurple,
	[
		[
			new PetMoveTemplate("Move 1", "description", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					return [];
				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 }),
			new PetMoveTemplate("Move 1", "description", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					return [];
				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 })
		],
		[
			new PetMoveTemplate("Move 2", "description", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					return [];
				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 }),
			new PetMoveTemplate("Move 2", "description", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					return [];
				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 })
		]
	]
);
