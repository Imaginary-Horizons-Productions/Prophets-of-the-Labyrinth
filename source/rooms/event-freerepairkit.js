const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Repair Kit, just hanging out",
	"Earth",
	"There's a Repair Kit hanging in the middle of the room tied to the ceiling by a rope.",
	[
		new ResourceTemplate("1", "internal", "Repair Kit").setCostExpression("0")
	]
).setBuildUI(
	function (adventure) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("freerepairkit")
					.setLabel("Take the Repair Kit")
					.setStyle(ButtonStyle.Primary)
			)
		];
	}
);
