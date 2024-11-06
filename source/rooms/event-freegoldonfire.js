const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { SAFE_DELIMITER } = require("../constants");

module.exports = new RoomTemplate("Free Gold?",
	"Fire",
	"A large pile of gold sits quietly in the middle of the room, seemingly alone.",
	[
		new ResourceTemplate("300", "internal", "Currency")
	],
	function (adventure) {
		adventure.room.history = {
			"Burned": []
		};
	},
	function (roomEmbed, adventure) {
		let reward = 300;
		let burnDamage = 100;
		let getEmoji = "💰";
		let getLabel = `Leaving it would be a waste [+${reward}g]`;
		let isGetDisabled = false;
		if (adventure.room.history.Burned.length > 0) {
			getEmoji = "🔥";
			getLabel = `+${reward}g, ${adventure.room.history.Burned[0]} -${burnDamage} HP`;
			isGetDisabled = true;
		} else if (!("Gold" in adventure.room.resources)) {
			getEmoji = "✔️";
			getLabel = `+${reward}g`;
			isGetDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`getgoldonfire${SAFE_DELIMITER}${burnDamage}`)
						.setStyle(ButtonStyle.Danger)
						.setEmoji(getEmoji)
						.setLabel(getLabel)
						.setDisabled(isGetDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
