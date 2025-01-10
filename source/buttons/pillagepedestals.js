const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "pillagepedestals";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Disable artifact dupe, gain gold */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.room.actions > 0) {
			adventure.room.actions = 0;
			adventure.gainGold(350);
			interaction.update(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
