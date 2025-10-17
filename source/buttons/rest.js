const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth, receiptToResultLine } = require('../util/combatantUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "rest";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Restore healPercent max hp to the user */
	(interaction, [healPercent]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const actionCost = 1;
		if (adventure.room.actions < actionCost) {
			interaction.reply({ content: "No more actions can be taken in this room.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		adventure.room.actions -= actionCost;
		adventure.room.history.Rested.push(delver.name);
		interaction.update(renderRoom(adventure, interaction.channel)).then(() => {
			interaction.followUp(receiptToResultLine(gainHealth(delver, Math.ceil(delver.getMaxHP() * (parseInt(healPercent) / 100.0)), adventure)));
			setAdventure(adventure);
		});
	}
);
