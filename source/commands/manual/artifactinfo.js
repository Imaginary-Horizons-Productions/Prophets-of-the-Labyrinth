const { CommandInteraction } = require("discord.js");
const { getArtifact, artifactNames } = require("../../artifacts/_artifactDictionary");
const { generateArtifactEmbed } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const artifactName = interaction.options.getString("artifact-name");
	const artifactTemplate = getArtifact(artifactName);
	if (!artifactTemplate) {
		interaction.reply({ content: `Could not find an artifact named ${artifactName}.`, ephemeral: true });
		return;
	}

	interaction.reply({ embeds: [generateArtifactEmbed(artifactTemplate, 1, null)], ephemeral: true });
};

module.exports = {
	data: {
		name: "artifact-info",
		description: "Look up details on an artifact",
		optionsInput: [
			{
				type: "String",
				name: "artifact-name",
				description: "Artifacts can stack; information provided is for 1 stack",
				required: true,
				autocomplete: artifactNames.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
