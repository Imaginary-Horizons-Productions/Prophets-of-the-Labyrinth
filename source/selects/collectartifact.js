const { SelectWrapper } = require('../classes');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');

const mainId = "collectartifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Add the selected artifact to the player's profile */
	(interaction, args) => {
		const [artifactName] = interaction.values;
		const player = getPlayer(interaction.user.id, interaction.guildId);
		player.artifacts[interaction.channelId] = artifactName;
		setPlayer(player);
		interaction.reply({ content: `You decide to hold onto a ${artifactName}. You'll be able to bring it on future adventures.`, ephemeral: true });
	}
);
