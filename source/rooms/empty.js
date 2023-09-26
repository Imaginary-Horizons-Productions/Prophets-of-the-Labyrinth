const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../../constants.js");

module.exports = new RoomTemplate("Empty Room",
	"Untyped",
	"This room is empty. Lucky you?",
	[]
).setBuildUI(
	function (adventure) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}Battle${SAFE_DELIMITER}${adventure.depth}`)
					.setLabel("Move on to a Battle")
					.setStyle(ButtonStyle.Secondary)
			)
		];
	}
);
