const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "stealwishingwellcore";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Disable wishing well, gain gold */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		adventure.gainGold(150);
		adventure.room.history["Core thief"].push(interaction.member.displayName);
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
	}
);
