const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Workshop with Black Box",
	"@{adventure}",
	"In this workshop there's a black box with a gear-shaped key hole on the front. You figure it's designed to trade a piece of your gear for a Rare piece of gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("1", "internal", "gear").setTier("Rare").setCostExpression("0")
	],
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("upgrade")
						.setLabel("Consider gear upgrades")
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("viewrepairs")
						.setLabel("Plan gear repairs")
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("viewblackbox")
						.setLabel("Open the black box")
						.setEmoji("0️⃣")
						.setStyle(ButtonStyle.Success)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
