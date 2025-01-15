const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { MAX_MESSAGE_ACTION_ROWS, SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "gearcapup";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Spend gold to raise the party's gear capacity */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.gearCapacity < MAX_MESSAGE_ACTION_ROWS) {
			const [_, cost] = interaction.customId.split(SAFE_DELIMITER);
			const parsedCost = parseInt(cost);
			if (adventure.gold >= parsedCost) {
				adventure.gold -= parsedCost;
				adventure.gearCapacity++;
				adventure.room.history["Cap boosters"].push(interaction.member.displayName);
				setAdventure(adventure);
				interaction.channel.send(`The party's gear capacity has been boosted to ${adventure.gearCapacity}.`);
			}
		}
		interaction.update(renderRoom(adventure, interaction.channel));
	}
);
