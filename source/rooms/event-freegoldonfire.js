const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Free Gold?",
	"Fire",
	"A large pile of gold sits quietly in the middle of the room, seemingly alone.",
	[
		new ResourceTemplate("300", "internal", "gold")
	],
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("getgoldonfire")
						.setLabel("Would be a waste to leave it there [+300 gold]")
						.setStyle(ButtonStyle.Danger)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
