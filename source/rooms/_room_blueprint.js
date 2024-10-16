const { RoomTemplate, ResourceTemplate } = require("../classes");

const enemies = [["name", "countExpression"], ["name", "countExpression"]];

module.exports = new RoomTemplate("name",
	"element",
	"primary category",
	"description",
	[
		new ResourceTemplate("countExpression", "visibility", "type")
	],
	function (adventure) { return {}; },
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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
