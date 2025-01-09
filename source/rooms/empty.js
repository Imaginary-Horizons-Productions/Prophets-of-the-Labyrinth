const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Empty Room",
	"Unaligned",
	"This room is empty. Lucky you?",
	function (adventure) {
		return [];
	},
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}Battle${SAFE_DELIMITER}${adventure.depth}`)
						.setLabel("Move on to a Battle")
						.setStyle(ButtonStyle.Secondary)
				)
			]
		};
	}
);
