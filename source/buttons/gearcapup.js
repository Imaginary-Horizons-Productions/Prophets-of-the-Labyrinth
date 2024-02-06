const { ButtonWrapper } = require('../classes');
const { MAX_MESSAGE_ACTION_ROWS } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "gearcapup";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Consumes a roomAction to raise Adventure's gear capacity */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const actionCost = 1;
		if (adventure.room.resources.roomAction.count < actionCost) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		if (adventure.gearCapacity < MAX_MESSAGE_ACTION_ROWS) {
			adventure.gearCapacity++;
			adventure.room.decrementResource("roomAction", actionCost);
			adventure.room.history["Cap boosters"].push(interaction.member.displayName);
			setAdventure(adventure);
			interaction.channel.send(`The party's gear capacity has been boosted to ${adventure.gearCapacity}.`);
		}
		interaction.update(renderRoom(adventure, interaction.channel));
	}
);
