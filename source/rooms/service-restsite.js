const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER, ICON_CONFIRM, ICON_CANCEL } = require("../constants");
const { generateRoutingRow, inspectSelfButton, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Rest Site & Training Dummy",
	"@{adventure}",
	"The room contains a campfire and a training dummy.",
	function (adventure) {
		adventure.room.actions = adventure.delvers.length;

		adventure.room.history = {
			"Rested": [],
			"Trained": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
		let restEmoji, restLabel, trainingEmoji, trainingLabel;
		const hasRoomActions = adventure.room.actions > 0;
		if (hasRoomActions) {
			restEmoji = "1️⃣";
			restLabel = `Rest [+${healPercent}% HP]`;
			trainingEmoji = "1️⃣";
			trainingLabel = "Train [+1 Level]";
		} else {
			if (adventure.room.history.Rested.length > 0) {
				restEmoji = ICON_CONFIRM;
				restLabel = "The party rested";
			} else {
				restEmoji = ICON_CANCEL;
				restLabel = "The fire has burned out";
			}
			if (adventure.room.history.Trained.length > 0) {
				trainingEmoji = ICON_CONFIRM;
				trainingLabel = "The party trained";
			} else {
				trainingEmoji = ICON_CANCEL;
				trainingLabel = "The party didn't train";
			}
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					inspectSelfButton,
					new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(restEmoji)
						.setLabel(restLabel)
						.setDisabled(!hasRoomActions),
					new ButtonBuilder().setCustomId("trainingdummy")
						.setStyle(ButtonStyle.Success)
						.setEmoji(trainingEmoji)
						.setLabel(trainingLabel)
						.setDisabled(!hasRoomActions)
				),
				generateRoutingRow(adventure)
			]
		}
	}
);
