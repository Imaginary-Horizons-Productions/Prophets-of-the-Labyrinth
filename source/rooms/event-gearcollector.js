const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { getNumberEmoji } = require("../util/textUtil");

module.exports = new RoomTemplate("Gear Collector",
	"@{adventure}",
	"The Gear Collector excitedly approaches you offering gold to help complete their collection.",
	[
		new ResourceTemplate("0.5*n", "internal", "roomAction")
	],
	function (roomEmbed, adventure) {
		const isOutOfRoomActions = adventure.room.resources.roomAction.count < 1;
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("viewgearcollector")
						.setStyle(ButtonStyle.Primary)
						.setLabel(isOutOfRoomActions ? "Gear traded" : "Sell gear")
						.setEmoji(getNumberEmoji(1))
						.setDisabled(isOutOfRoomActions)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
