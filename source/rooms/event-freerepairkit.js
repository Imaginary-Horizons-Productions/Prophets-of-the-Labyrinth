const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Repair Kit, just hanging out",
	"Earth",
	"There's a Repair Kit hanging in the middle of the room tied to the ceiling by a rope.",
	[
		new ResourceTemplate("1", "internal", "Repair Kit").setCostExpression("0")
	],
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("freerepairkit")
						.setLabel("Take the Repair Kit")
						.setStyle(ButtonStyle.Primary)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
