const { ActionRowBuilder, ButtonBuilder, ButtonStyle, italic } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { rollArtifactWithExclusions } = require("../artifacts/_artifactDictionary");
const { SAFE_DELIMITER } = require("../constants");
const { generateRoutingRow, partyStatsButton } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Door 1 or Door 2?",
	"@{adventureOpposite}",
	"Event",
	"There are four doors in this room. Two of them are labelled with numbers \"Door 1\" and \"Door 2\" and have coin insert slots. The other two doors are the entrance and exit.",
	[],
	function (adventure) {
		const ownedArtifacts = Object.keys(adventure.artifacts);
		const door1Artifact = ownedArtifacts.length > 0 ? ownedArtifacts[adventure.generateRandomNumber(ownedArtifacts.length, "general")] : null;
		const door2Artifact = rollArtifactWithExclusions(adventure, ownedArtifacts);
		return {
			"Artifacts": [door1Artifact, door2Artifact],
			"Option Picked": []
		};
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
			door1Label = `${door1Cost}g: Pick Door 1`;
			door1Emoji = "❔";
			door2Label = `${door2Cost}g: Pick Door 2`;
			door2Emoji = "❔";
		} else if (adventure.room.history["Option Picked"][0] === "0") {
			door1Label = `${door1Cost}g: ${adventure.room.history.Artifacts[0]}`;
			door1Emoji = "✔️";
			door2Label = "Didn't Pick Door 2";
			door2Emoji = "✖️";
		} else {
			door1Label = "Didn't Pick Door 1";
			door1Emoji = "✖️";
			door2Label = `${door2Cost}g: ${adventure.room.history.Artifacts[1]}`;
			door2Emoji = "✔️";
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`eventartifact${SAFE_DELIMITER}0${SAFE_DELIMITER}${door1Cost}`)
						.setStyle(ButtonStyle.Primary)
						.setEmoji(door1Emoji)
						.setLabel(door1Label)
						.setDisabled(partyHasPicked || partyCannotAffordDoor1 || partyHasNoArtifacts),
					new ButtonBuilder().setCustomId(`eventartifact${SAFE_DELIMITER}1${SAFE_DELIMITER}${door2Cost}`)
						.setStyle(ButtonStyle.Primary)
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
