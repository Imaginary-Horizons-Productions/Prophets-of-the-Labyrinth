const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { generateRoutingRow, inspectSelfButton } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Rest Site: Training Dummy",
	"@{adventure}",
	"The room contains a campfire and a training dummy.",
	[],
	function (adventure) {
		adventure.room.actions = adventure.delvers.length;

		adventure.room.history = {
			"Rested": [],
			"Trained": []
		};
	},
	function (roomEmbed, adventure) {
		const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
		let restEmoji, restLabel, trainingEmoji, trainingLabel;
		const hasRoomActions = adventure.room.actions > 0;
		if (hasRoomActions) {
			restEmoji = "1️⃣";
			restLabel = `Rest [+${healPercent}% HP]`;
			trainingEmoji = "1️⃣";
			trainingLabel = "Use the training dummy";
		} else {
			if (adventure.room.history.Rested.length > 0) {
				restEmoji = "✔️";
				restLabel = "The party rested";
			} else {
				restEmoji = "✖️";
				restLabel = "The fire has burned out";
			}
			if (adventure.room.history.Trained.length > 0) {
				trainingEmoji = "✔️";
				trainingLabel = "The party trained";
			} else {
				trainingEmoji = "✖️";
				trainingLabel = "The party didn't train";
			}
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					inspectSelfButton,
					new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
						.setStyle(ButtonStyle.Primary)
						.setEmoji(restEmoji)
						.setLabel(restLabel)
						.setDisabled(!hasRoomActions),
					new ButtonBuilder().setCustomId("trainingdummy")
						.setStyle(ButtonStyle.Primary)
						.setEmoji(trainingEmoji)
						.setLabel(trainingLabel)
						.setDisabled(!hasRoomActions)
				),
				generateRoutingRow(adventure)
			]
		}
	}
);
