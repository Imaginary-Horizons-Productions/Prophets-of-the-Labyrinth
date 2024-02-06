const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER, EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "repair";
module.exports = new SelectWrapper(mainId, 3000,
	/** Grant half the selected gear's max durability */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [gearName, index, value] = interaction.values[0].split(SAFE_DELIMITER);
		delver.gear[Number(index)].durability += Number(value);
		adventure.room.history.Repairers.push(delver.name);
		adventure.room.decrementResource("roomAction", 1);
		setAdventure(adventure);
		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		interaction.channel.send({ content: `**${interaction.member.displayName}** repaired ${value} durability on their ${gearName}.` });
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			return roomMessage.edit(renderRoom(adventure, interaction.channel));
		})
	}
);
