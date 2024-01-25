const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { SAFE_DELIMITER } = require("../constants");

module.exports = new RoomTemplate("The Score Beggar",
	"Water",
	"In the center of the room sits a desolate beggar.\n\"Score... more score... I need it! I'll give you this.\"\nThe beggar motions to a flask of questionable liquid.",
	[],
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}score`)
						.setLabel("Take the flask [-50 score, +1 life]")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}placebo`)
						.setLabel("Trade a Placebo [-1 Placebo, +1 life]")
						.setStyle(ButtonStyle.Primary)
						.setDisabled(!("Placebo" in adventure.items))
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
