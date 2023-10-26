const { SelectWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');

const mainId = "collectartifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Add the selected artifact to the player's profile */
	(interaction, args) => {
		const [artifactName] = interaction.values;
		const player = getPlayer(interaction.user.id, interaction.guildId);
		player.artifacts[interaction.channelId] = artifactName;
		setPlayer(player);
		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		interaction.channel.send({ content: `${interaction.user.displayName} decides to hold onto a **${artifactName}**. They'll be able to bring it on future adventures.`, ephemeral: true });
	}
);
