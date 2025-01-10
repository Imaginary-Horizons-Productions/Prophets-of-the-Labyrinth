const { MessageFlags } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "artifactdupe";
module.exports = new SelectWrapper(mainId, 3000,
	/** Give the party 1 copy of the specified artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.room.actions > 0) {
			adventure.room.actions = 0;
			const artifactName = interaction.values[0];
			adventure.room.history["Duped artifact"].push(artifactName);
			adventure.gainArtifact(artifactName, 1);
			interaction.update(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
