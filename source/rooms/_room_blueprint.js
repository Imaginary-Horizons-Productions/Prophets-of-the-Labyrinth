const { RoomTemplate, ResourceTemplate } = require("../classes");
const { pathVoteField } = require("../util/messageComponentUtil");

const enemies = [["name", "countExpression"], ["name", "countExpression"]];

module.exports = new RoomTemplate("name",
	"element",
	"description",
	[
		new ResourceTemplate("countExpression", "visibility", "type")
	],
	function (adventure) {
		adventure.room.actions = 0;

		adventure.room.history = {};
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
).setEnemies(enemies);
