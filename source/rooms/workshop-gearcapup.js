const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Tanning Workshop",
	"@{adventure}",
	"This workshop contains various leatherworking tools. You could make some bags, bandoliers, or holsters for the party go carry more gear.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
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
				new ButtonBuilder().setCustomId("gearcapup")
					.setLabel("Increase the party's Gear Capacity")
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Success)
			)
		];
	}
);
