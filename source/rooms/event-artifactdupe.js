const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { getArtifact } = require("../artifacts/_artifactDictionary");
const { trimForSelectOptionDescription } = require("../util/textUtil");
const { EMPTY_SELECT_OPTION_SET } = require("../constants");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Twin Pedestals",
	"@{adventure}",
	"There are two identical pedestals in this room. If you place an artifact on one, it'll duplicate onto the other.",
	[
		new ResourceTemplate("1", "internal", "roomAction")
	],
	function (roomEmbed, adventure) {
		const hasRoomActions = adventure.room.resources.roomAction.count > 0;
		let duperLabel, duperOptions, isDuperDisabled, pillageLabel, pillageEmoji, isPillageDisabled;
		if (hasRoomActions) {
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
			} else {
				duperLabel = "Pick an artifact to duplicate...";
			}
			pillageLabel = "Pillage the Pedestals [+350g]";
			pillageEmoji = "💰";
			isPillageDisabled = false;
		} else {
			const dupedArtifact = Object.keys(adventure.room.resources).find(resourceName => resourceName.startsWith("Duped: "))?.split(": ")[1];
			if (dupedArtifact) {
				duperLabel = `Duplicated: ${dupedArtifact}`;
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
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
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
