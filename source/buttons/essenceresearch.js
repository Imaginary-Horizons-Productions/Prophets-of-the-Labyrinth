const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getEmoji } = require('../util/essenceUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "essenceresearch";
module.exports = new ButtonWrapper(mainId, 3000,
	/** gain gold, switch user's essence to the room's essence */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (delver.essence === adventure.room.essence) {
			interaction.reply({ content: `You are already ${adventure.room.essence}.`, ephemeral: true });
			return;
		}

		adventure.gainGold(200);
		delver.essence = adventure.room.essence;
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
		interaction.channel.send(`**${interaction.member.displayName}** signs the contract and becomes ${getEmoji(adventure.room.essence)} ${adventure.room.essence} essence.`);
	}
);
