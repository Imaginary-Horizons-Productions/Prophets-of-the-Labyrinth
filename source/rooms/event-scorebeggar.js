const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("The Score Beggar",
	"Water",
	"In the center of the room sits a desolate beggar.\n\"Score... more score... I need it! I'll give you this.\"\nThe beggar motions to a flask of questionable liquid.",
	[],
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("buylife")
						.setLabel("Take the flask [-50 score, +1 life]")
						.setStyle(ButtonStyle.Success)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
