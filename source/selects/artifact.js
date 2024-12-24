const { EmbedBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getArtifact } = require('../artifacts/_artifactDictionary');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getEmoji, getColor } = require('../util/essenceUtil');
const { randomFooterTip } = require('../util/embedUtil');

const mainId = "artifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Provide information about the selected artifact */
	(interaction, [pageIndex]) => {
		const [artifactName, artifactCount] = interaction.values[0].split(SAFE_DELIMITER);
		const artifact = getArtifact(artifactName);
		const embed = new EmbedBuilder().setColor(getColor(artifact.essence))
			.setTitle(`${getEmoji(artifact.essence)} ${artifactName} x ${artifactCount}`)
			.setDescription(artifact.dynamicDescription(Number(artifactCount)))
			.addFields({ name: "Scaling", value: artifact.scalingDescription })
			.setFooter(randomFooterTip());
		if (artifact.flavorText) {
			embed.addFields(artifact.flavorText);
		}
		const adventure = getAdventure(interaction.channelId);
		const artifactCopy = Object.assign({}, adventure.artifacts[artifactName]);
		delete artifactCopy["count"];
		Object.entries(artifactCopy).forEach(([statistic, value]) => {
			embed.addFields({ name: statistic, value: value.toString() });
		})
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
);
