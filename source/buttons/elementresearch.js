const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getEmoji } = require('../util/elementUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "elementresearch";
module.exports = new ButtonWrapper(mainId, 3000,
	/** gain gold, switch user's element to the room's element */
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
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
		interaction.channel.send(`**${interaction.member.displayName}** signs the contract and becomes ${getEmoji(adventure.room.element)} ${adventure.room.element} element.`);
	}
);
