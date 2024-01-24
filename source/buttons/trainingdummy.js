const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { levelUp } = require('../util/delverUtil');
const { consumeRoomActions, editButtons } = require('../util/messageComponentUtil');

const mainId = "trainingdummy";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Consume a room action to level up */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const actionCost = 1;
		if (adventure.room.resources.roomAction.count < actionCost) {
			interaction.reply({ content: "You don't have time to use the training dummy.", ephemeral: true });
			return;
		}

		levelUp(delver, 1, adventure);
		const { embeds, remainingActions } = consumeRoomActions(adventure, interaction.message.embeds, actionCost);
		let components = interaction.message.components;
		if (remainingActions < 1) {
			const healPercent = Math.trunc(30 * (1 - (adventure.getChallengeIntensity("Restless") / 100)));
			components = editButtons(components, {
				[mainId]: { preventUse: true, label: "Some training happened", emoji: "✔️" },
				[`rest${SAFE_DELIMITER}${healPercent}`]: { preventUse: true, label: "The fire has burned out", emoji: "✔️" }
			})
		}
		interaction.update({ embeds, components }).then(() => {
			interaction.followUp(`${delver.getName()} leveled up!`);
			setAdventure(adventure);
		});
	}
);
