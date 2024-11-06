const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { getNumberEmoji } = require("../util/textUtil");

module.exports = new RoomTemplate("Gear Collector",
	"@{adventure}",
	"The Gear Collector excitedly approaches you offering gold to help complete their collection.",
	[],
	function (adventure) {
		adventure.room.actions = Math.ceil(adventure.delvers.length / 2);

		adventure.room.history = {};
	},
	function (roomEmbed, adventure) {
		if (adventure.room.actions > 0) {
			return {
				embeds: [roomEmbed.addFields(pathVoteField)],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("selltogearcollector")
							.setStyle(ButtonStyle.Primary)
							.setLabel("Sell gear")
							.setEmoji(getNumberEmoji(1))
					),
					generateRoutingRow(adventure)
				]
			};
		} else {
			return {
				embeds: [roomEmbed.addFields(pathVoteField)],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("viewgearcollector")
							.setStyle(ButtonStyle.Primary)
							.setLabel("Gear traded")
							.setEmoji(getNumberEmoji(1))
							.setDisabled(true)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
);
