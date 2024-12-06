const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { getNumberEmoji } = require("../util/textUtil");

module.exports = new RoomTemplate("Gear Collector",
	"@{adventure}",
	"The Gear Collector excitedly rushes past a mysterious black box to offer you gold to help complete their collection.",
	[
		new ResourceTemplate("1", "internal", "Artifact")
	],
	function (adventure) {
		adventure.room.actions = Math.ceil(adventure.delvers.length / 2);

		adventure.room.history = {
			"Traded for box": []
		};
	},
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("selltogearcollector")
						.setStyle(ButtonStyle.Success)
						.setLabel("Sell gear")
						.setEmoji(getNumberEmoji(1))
						.setDisabled(adventure.room.actions < 1),
					new ButtonBuilder().setCustomId("blackbox")
						.setStyle(ButtonStyle.Primary)
						.setEmoji("◼")
						.setLabel("A black box?")
						.setDisabled(adventure.room.history["Traded for box"].length > 0)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
