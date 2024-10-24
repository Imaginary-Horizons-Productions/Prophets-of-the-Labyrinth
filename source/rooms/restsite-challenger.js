const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Rest Site: Mysterious Challenger",
	"@{adventure}",
	"Rest Site",
	"The room contains a campfire... and a mysterious challenger hanging out in the corner.",
	[
		new ResourceTemplate("n", "internal", "roomAction"),
		new ResourceTemplate("2", "internal", "challenge")
	],
	function (adventure) {
		return {
			"Rested": [],
			"New challenges": []
		};
	},
	function (roomEmbed, adventure) {
		const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
		let restEmoji, restLabel, challengeEmoji, challengeLabel;
		const hasRoomActions = adventure.room.hasResource("roomAction");
		if (hasRoomActions) {
			restEmoji = "1️⃣";
			restLabel = `Rest [+${healPercent}% HP]`;
			challengeEmoji = "1️⃣";
			challengeLabel = "Take a challenge";
		} else {
			if (adventure.room.history.Rested.length > 0) {
				restEmoji = "✔️";
				restLabel = "The party rested";
			} else {
				restEmoji = "✖️";
				restLabel = "The fire has burned out";
			}
			if (adventure.room.history["New challenges"].length > 0) {
				challengeEmoji = "✔️";
				if (adventure.room.history["New challenges"].length === 1) {
					challengeLabel = "New challenge taken";
				} else {
					challengeLabel = "New challenges taken";
				}
			} else {
				challengeEmoji = "✖️";
				challengeLabel = "The challenger is gone";
			}
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`rest${SAFE_DELIMITER}${healPercent}`)
						.setStyle(ButtonStyle.Primary)
						.setEmoji(restEmoji)
						.setLabel(restLabel)
						.setDisabled(!hasRoomActions),
					new ButtonBuilder().setCustomId("challenges")
						.setStyle(ButtonStyle.Danger)
						.setEmoji(challengeEmoji)
						.setLabel(challengeLabel)
						.setDisabled(!hasRoomActions)
				),
				generateRoutingRow(adventure)
			]
		}
	}
);
