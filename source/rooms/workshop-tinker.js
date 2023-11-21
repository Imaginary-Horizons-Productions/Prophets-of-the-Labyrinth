const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The forge in this room could be used to recast some of your upgraded gear to change it's form.",
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
				new ButtonBuilder().setCustomId("tinker")
					.setLabel("Tinker with your gear")
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Success)
			)
		];
	}
);
