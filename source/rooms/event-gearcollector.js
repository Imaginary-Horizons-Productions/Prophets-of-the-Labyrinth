const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { getNumberEmoji } = require("../util/textUtil");

module.exports = new RoomTemplate("Gear Collector",
	"@{adventure}",
	"Event",
	"The Gear Collector excitedly approaches you offering gold to help complete their collection.",
	[
		new ResourceTemplate("0.5*n", "internal", "roomAction")
	],
	function (adventure) { return {}; },
	function (roomEmbed, adventure) {
		if (adventure.room.hasResource("roomAction")) {
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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
