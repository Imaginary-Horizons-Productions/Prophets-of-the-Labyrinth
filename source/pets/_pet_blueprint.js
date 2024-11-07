const { PetTemplate, PetMoveTemplate } = require("../classes");

const petName = "";
module.exports = new PetTemplate(petName,
	[
		[
			new PetMoveTemplate("Move 1", "description", () => [],
				(targets, owner, adventure) => {

				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 }),
			new PetMoveTemplate("Move 1", "description", () => [],
				(targets, owner, adventure) => {

				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 })
		],
		[
			new PetMoveTemplate("Move 2", "description", () => [],
				(targets, owner, adventure) => {

				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 }),
			new PetMoveTemplate("Move 2", "description", () => [],
				(targets, owner, adventure) => {

				}).setRnConfig([])
				.setModifiers({ name: "modifier", stacks: 0 })
		]
	]
);
