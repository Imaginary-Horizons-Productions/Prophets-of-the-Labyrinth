const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');

const mainId = "elementswap";
module.exports = new ButtonWrapper(mainId, 3000,
	/** +200g, switch user's element to the room's element */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (delver.element === adventure.room.element) {
			interaction.reply({ content: `You are already ${adventure.room.element}.`, ephemeral: true });
			return;
		}

		adventure.gainGold(200);
		delver.element = adventure.room.element;
		updateRoomHeader(adventure, interaction.message);
		interaction.reply(`**${interaction.member.displayName}** signs the contract and becomes ${adventure.room.element} element.`).then(() => {
			setAdventure(adventure);
		});
	}
);
