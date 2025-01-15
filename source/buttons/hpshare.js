const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, completeAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth, payHP } = require('../util/combatantUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "hpshare";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Take hp from user, give to party members */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const goldCost = 50;
		if (adventure.gold < goldCost) {
			interaction.reply({ content: "You can't afford this contract.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		adventure.gold -= goldCost;
		adventure.room.history["HP Donor"].push(delver.name);
		const hpLost = Math.min(100, delver.hp);
		const hpGained = hpLost;
		const resultText = `${payHP(delver, hpLost, adventure).join(" ")} Everyone else gains ${hpGained} hp.`;
		adventure.delvers.forEach(delver => {
			if (delver.id != interaction.user.id) {
				gainHealth(delver, hpGained, adventure);
			}
		})
		setAdventure(adventure);
		if (adventure.lives < 1) {
			interaction.update(completeAdventure(adventure, interaction.channel, "defeat", resultText));
		} else {
			interaction.update(renderRoom(adventure, interaction.channel));
			interaction.channel.send(resultText);
		}
	}
);
