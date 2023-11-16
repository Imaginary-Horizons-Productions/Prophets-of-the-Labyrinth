const { ButtonWrapper } = require('../classes');
const { getAdventure, completeAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth, payHP } = require('../util/combatantUtil');
const { editButtons } = require('../util/messageComponentUtil');

const mainId = "hpshare";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Take hp from user, give to party members */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const goldCost = 50;
		if (adventure.gold < goldCost) {
			interaction.reply({ content: "You can't afford this contract.", ephemeral: true });
			return;
		}

		adventure.gold -= goldCost;
		const hpLost = 50;
		const hpGained = 50;
		const resultText = `${payHP(delver, hpLost, adventure)} Everyone else gains ${hpGained} hp.`;
		adventure.delvers.forEach(delver => {
			if (delver.id != interaction.user.id) {
				gainHealth(delver, hpGained, adventure);
			}
		})
		interaction.update({ components: editButtons(interaction.message.components, { [interaction.customId]: { preventUse: true, label: `${interaction.member.displayName} shared HP.`, emoji: "✔️" } }) });
		if (adventure.lives < 1) {
			interaction.channel.send(completeAdventure(adventure, interaction.channel, "defeat", resultText));
		} else {
			interaction.channel.send(resultText);
			setAdventure(adventure);
		}
	}
);
