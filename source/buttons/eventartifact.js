const { ButtonWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "eventartifact";
module.exports = new ButtonWrapper(mainId, 3000,
	(interaction, [artifactsHistoryIndex, cost]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (adventure.room.history["Option Picked"].length < 1) {
			adventure.room.history["Option Picked"].push(artifactsHistoryIndex);
			adventure.gold -= cost;
			adventure.gainArtifact(adventure.room.history.Artifacts[artifactsHistoryIndex], 1);
			interaction.update(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
