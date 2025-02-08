const { ActionRowBuilder, ButtonBuilder, ButtonStyle, italic } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { rollArtifactWithExclusions } = require("../artifacts/_artifactDictionary");
const { SAFE_DELIMITER, ICON_CONFIRM, ICON_CANCEL } = require("../constants");
const { generateRoutingRow, partyStatsButton, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Door 1 or Door 2?",
	"@{adventureOpposite}",
	"There are four doors in this room. Two of them are labelled with numbers \"Door 1\" and \"Door 2\" and have coin insert slots. The other two doors are the entrance and exit.",
	function (adventure) {
		const ownedArtifacts = Object.keys(adventure.artifacts);
		const door1Artifact = ownedArtifacts.length > 0 ? ownedArtifacts[adventure.generateRandomNumber(ownedArtifacts.length, "general")] : null;
		const door2Artifact = rollArtifactWithExclusions(adventure, ownedArtifacts);
		adventure.room.history = {
			"Artifacts": [door1Artifact, door2Artifact],
			"Option Picked": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		const partyHasNoArtifacts = adventure.room.history.Artifacts[0] === null;
		const partyHasAllArtifacts = adventure.room.history.Artifacts[1] === null;
		const partyHasPicked = adventure.room.history["Option Picked"].length > 0;
		let door1Cost = 300;
		const partyCannotAffordDoor1 = adventure.gold < door1Cost;
		let door2Cost = 150;
		const partyCannotAffordDoor2 = adventure.gold < door2Cost;
		let door1Label, door1Emoji, door2Label, door2Emoji;
		roomEmbed.addFields({ name: "A Sixth Sense", value: `You get the feeling that Door 1 will have a random duplicate of an artifact the party owns, while Door 2 will have a random artifact the party doesn't own.${partyHasNoArtifacts || partyHasAllArtifacts ? ` ${italic(`You also get the feeling there's nothing behind Door ${partyHasNoArtifacts ? "1" : "2"}.`)}` : ""}` });
		if (!partyHasPicked) {
			door1Label = `Pick Door 1 [${door1Cost}g]`;
			door1Emoji = "❔";
			door2Label = `${door2Cost}g: Pick Door 2`;
			door2Emoji = "❔";
		} else if (adventure.room.history["Option Picked"][0] === "0") {
			door1Label = `${adventure.room.history.Artifacts[0]} [${door1Cost}g]`;
			door1Emoji = ICON_CONFIRM;
			door2Label = "Didn't Pick Door 2";
			door2Emoji = ICON_CANCEL;
		} else {
			door1Label = "Didn't Pick Door 1";
			door1Emoji = ICON_CANCEL;
			door2Label = `${adventure.room.history.Artifacts[1]} [${door2Cost}g]`;
			door2Emoji = ICON_CONFIRM;
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`eventartifact${SAFE_DELIMITER}0${SAFE_DELIMITER}${door1Cost}`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(door1Emoji)
						.setLabel(door1Label)
						.setDisabled(partyHasPicked || partyCannotAffordDoor1 || partyHasNoArtifacts),
					new ButtonBuilder().setCustomId(`eventartifact${SAFE_DELIMITER}1${SAFE_DELIMITER}${door2Cost}`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(door2Emoji)
						.setLabel(door2Label)
						.setDisabled(partyHasPicked || partyCannotAffordDoor2 || partyHasAllArtifacts),
					partyStatsButton
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
