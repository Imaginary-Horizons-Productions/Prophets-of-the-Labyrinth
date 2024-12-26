const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { getArtifact } = require("../artifacts/_artifactDictionary");
const { trimForSelectOptionDescription } = require("../util/textUtil");
const { EMPTY_SELECT_OPTION_SET } = require("../constants");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Twin Pedestals",
	"@{adventure}",
	"There are two identical pedestals in this room. If you place an artifact on one, it'll duplicate onto the other.",
	function (adventure) {
		adventure.room.actions = 1;

		adventure.room.history = {
			"Duped artifact": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		let duperLabel, duperOptions, isDuperDisabled, pillageLabel, pillageEmoji, isPillageDisabled;
		if (adventure.room.actions > 0) {
			duperOptions = Object.keys(adventure.artifacts).map(artifact => {
				const count = adventure.getArtifactCount(artifact);
				return {
					label: artifact,
					description: trimForSelectOptionDescription(getArtifact(artifact).dynamicDescription(count + 1)),
					value: artifact
				}
			});
			isDuperDisabled = duperOptions.length < 1;
			if (isDuperDisabled) {
				duperLabel = "No artifacts to duplicate";
				duperOptions = EMPTY_SELECT_OPTION_SET;
			} else {
				duperLabel = "Pick an artifact to duplicate...";
			}
			pillageLabel = "Pillage the Pedestals [+350g]";
			pillageEmoji = "💰";
			isPillageDisabled = false;
		} else {
			if (adventure.room.history["Duped artifact"].length > 0) {
				duperLabel = `Duplicated: ${adventure.room.history["Duped artifact"][0]}`;
				duperOptions = EMPTY_SELECT_OPTION_SET;
				isDuperDisabled = true;
				pillageLabel = "Pedestals used";
				pillageEmoji = "✖️";
				isPillageDisabled = true;
			} else {
				duperLabel = "Pedestals pillaged";
				duperOptions = EMPTY_SELECT_OPTION_SET;
				isDuperDisabled = true;
				pillageLabel = "+350g";
				pillageEmoji = "✔️";
				isPillageDisabled = true;
			}
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("artifactdupe")
						.setPlaceholder(duperLabel)
						.setOptions(duperOptions)
						.setDisabled(isDuperDisabled)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("pillagepedestals")
						.setStyle(ButtonStyle.Danger)
						.setLabel(pillageLabel)
						.setEmoji(pillageEmoji)
						.setDisabled(isPillageDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
