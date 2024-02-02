const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "stealwishingwellcore";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Disable wishing well, gain 250g */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		adventure.gainGold(250);
		delete adventure.room.resources["Wishing Well Core"];
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
	}
);
