const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
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
		const options = Object.keys(adventure.artifacts).map(artifact => {
			const count = adventure.getArtifactCount(artifact);
			return {
				label: artifact,
				description: trimForSelectOptionDescription(getArtifact(artifact).dynamicDescription(count + 1)),
				value: artifact
			}
		});
		if (options.length > 0) {
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId("artifactdupe")
							.setPlaceholder("Pick an artifact to duplicate...")
							.setOptions(options)
					),
					generateRoutingRow(adventure)
				]
			};
		} else {
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId("artifactdupe")
							.setPlaceholder("No artifacts to duplicate")
							.setDisabled(true)
							.setOptions(EMPTY_SELECT_OPTION_SET)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
);
