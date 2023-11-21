const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Workshop with Black Box",
	"@{adventure}",
	"In this workshop there's a black box with a gear-shaped key hole on the front. You figure it's designed to trade a piece of your gear for a Rare piece of gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("1", "internal", "gear").setTier("Rare").setCostExpression("0")
	]
).setBuildUI(
	function (adventure) {
		return [
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
			)
		];
	}
);
