const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The forge in this room could be used to recast some of your upgraded gear to change it's form.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
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
					new ButtonBuilder().setCustomId("tinker")
						.setLabel("Tinker with your gear")
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Success)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
