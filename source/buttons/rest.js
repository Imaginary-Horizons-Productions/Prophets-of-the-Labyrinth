const { ButtonWrapper } = require('../classes');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth } = require('../util/combatantUtil');
const { editButtons, consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "rest";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Restore healPercent max hp to the user */
	(interaction, [healPercent]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "No more actions can be taken in this room.", ephemeral: true });
			return;
		}

		const { embeds, remainingActions } = consumeRoomActions(adventure, interaction.message.embeds, 1);
		let components = interaction.message.components;
		if (remainingActions < 1) {
			components = editButtons(components, {
				[interaction.customId]: { preventUse: true, label: "The party rested", emoji: "✔️" },
				"viewchallenges": { preventUse: true, label: "The challenger is gone", emoji: "✖️" },
				"trainingdummy": { preventUse: true, label: "The party didn't train", emoji: "✔️" }
			});
		}
		interaction.update({ embeds, components }).then(() => {
			interaction.followUp(gainHealth(delver, Math.ceil(delver.getMaxHP() * (parseInt(healPercent) / 100.0)), adventure));
			setAdventure(adventure);
		});
	}
);
