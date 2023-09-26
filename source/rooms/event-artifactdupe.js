const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { getArtifact } = require("../artifacts/_artifactDictionary");

module.exports = new RoomTemplate("Twin Pedestals",
	"@{adventure}",
	"There are two identical pedestals in this room. If you place an artifact on one, it'll duplicate onto the other.",
	[
		new ResourceTemplate("roomAction", "1", "internal")
	]
).setBuildUI(
	function (adventure) {
		const options = Object.keys(adventure.artifacts).map(artifact => {
			const count = adventure.getArtifactCount(artifact);
			return {
				label: artifact,
				description: getArtifact(artifact).dynamicDescription(count + 1),
				value: artifact
			}
		});
		if (options.length > 0) {
			return [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("artifactdupe")
						.setPlaceholder("Pick an artifact to duplicate...")
						.setOptions(options)
				)
			];
		} else {
			return [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("artifactdupe")
						.setPlaceholder("No artifacts to duplicate")
						.setDisabled(true)
						.setOptions([{ label: "placeholder", value: "placeholder" }])
				)
			];
		}
	}
);
