const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { EMPTY_SELECT_OPTION_SET } = require("../constants");

module.exports = new RoomTemplate("Apple Pie Wishing Well",
	"Light",
	"In the center of the room sits a wishing well with a glowing crystal core. Pinned to a post in front of the well are instructions indicating that tossing an item into the well will float it back as a delicious apple pie.",
	[],
	function (adventure) {
		adventure.room.history = {
			"Items tossed": [],
			"Core thief": []
		};
	},
	function (roomEmbed, adventure) {
		let wellLabel, wellOptions, isWellDisabled, stealEmoji, stealLabel, isStealDisabled;
		if (adventure.room.history["Core thief"].length < 1) {
			wellOptions = Object.entries(adventure.items).map(([itemName, count]) => ({ label: itemName, description: `Stock: ${count}`, value: itemName }));
			isWellDisabled = wellOptions.length < 1;
			if (!isWellDisabled) {
				wellLabel = "Select an item to toss...";
			} else {
				wellLabel = "No items to toss";
				wellOptions = EMPTY_SELECT_OPTION_SET;
			}

			if (adventure.room.history["Items tossed"].length > 0) {
				stealEmoji = "✖️";
				stealLabel = "Well used";
				isStealDisabled = true;
			} else {
				stealEmoji = "💰";
				stealLabel = "Steal the core [+150g]";
				isStealDisabled = false;
			}
		} else {
			wellLabel = "Wishing Well Core stolen";
			wellOptions = EMPTY_SELECT_OPTION_SET;
			isWellDisabled = true;
			stealEmoji = "✔️";
			stealLabel = "+150g";
			isStealDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("applepiewishingwell")
						.setPlaceholder(wellLabel)
						.setOptions(wellOptions)
						.setDisabled(isWellDisabled)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("stealwishingwellcore")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(stealEmoji)
						.setLabel(stealLabel)
						.setDisabled(isStealDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
