const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Tanning Workshop",
	"@{adventure}",
	"This workshop contains various leatherworking tools. You could make some bags, bandoliers, or holsters for the party go carry more gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
	],
	function (adventure) { return {}; },
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
					new ButtonBuilder().setCustomId("gearcapup")
						.setLabel("Increase party Gear Capacity")
						.setEmoji("1️⃣")
						.setStyle(ButtonStyle.Success)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
