const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Abandoned Forge",
	"@{adventure}",
	"The room contains an abandoned forge. There seem to be enough supplies leftover for everyone to do something.",
	[
		new ResourceTemplate("n", "internal", "roomAction")
	]
).setBuildUI(
	function (adventure) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId("upgrade")
					.setLabel("Consider equipment upgrades")
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId("viewrepairs")
					.setLabel("Plan equipment repairs")
					.setEmoji("1️⃣")
					.setStyle(ButtonStyle.Primary)
			)
		];
	}
);
