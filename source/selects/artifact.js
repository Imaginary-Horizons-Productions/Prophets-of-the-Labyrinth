const { EmbedBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getArtifact } = require('../artifacts/_artifactDictionary');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getEmoji } = require('../util/elementUtil');

const mainId = "artifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Provide information about the selected artifact */
	(interaction, [pageIndex]) => {
		const [artifactName, artifactCount] = interaction.values[0].split(SAFE_DELIMITER);
		const artifact = getArtifact(artifactName);
		const embed = new EmbedBuilder()
			.setTitle(`${getEmoji(artifact.element)} ${artifactName} x ${artifactCount}`)
			.setDescription(artifact.dynamicDescription(artifactCount))
			.addFields({ name: "Scaling", value: artifact.scalingDescription })
			.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
		if (artifact.flavorText) {
			embed.addFields(artifact.flavorText);
		}
		const adventure = getAdventure(interaction.channel.id);
		const artifactCopy = Object.assign({}, adventure.artifacts[artifactName]);
		delete artifactCopy["count"];
		Object.entries(artifactCopy).forEach(([statistic, value]) => {
			embed.addFields({ name: statistic, value: value.toString() });
		})
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
);
