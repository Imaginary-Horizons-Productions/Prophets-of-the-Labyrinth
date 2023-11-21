const { ButtonWrapper } = require('../classes');
const { MAX_MESSAGE_ACTION_ROWS } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { consumeRoomActions, editButtons } = require('../util/messageComponentUtil');

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

		adventure.gearCapacity++;
		const { embeds, remainingActions } = consumeRoomActions(adventure, interaction.embeds, actionCost);
		let components = interaction.message.components;
		if (remainingActions < 1) {
			components = editButtons(components, {
				[mainId]: { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
				"tinker": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
				"upgrade": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
				"viewblackbox": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
				"viewrepairs": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" }
			});
		} else if (adventure.gearCapacity >= MAX_MESSAGE_ACTION_ROWS) {
			adventure.gearCapacity = MAX_MESSAGE_ACTION_ROWS;
			components = editButtons(components, {
				[mainId]: { preventUse: true, label: "Max Gear Capacity", emoji: "✔️" }
			});
		}
		setAdventure(adventure);
		interaction.update({ embeds, components });
		interaction.channel.send(`The party's gear capacity has been boosted to ${adventure.gearCapacity}.`);
	}
);
