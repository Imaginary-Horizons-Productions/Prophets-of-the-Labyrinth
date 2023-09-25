const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

module.exports = new RoomTemplate("Free Gold?",
	"Fire",
	"A large pile of gold sits quietly in the middle of the room, seemingly alone.",
	[
		new ResourceTemplate("300", "internal", "gold")
	]
).setBuildUI(
	function (adventure) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("getgoldonfire")
					.setLabel("Would be a waste to leave it there [+300 gold]")
					.setStyle(ButtonStyle.Danger)
			)
		];
	}
);
