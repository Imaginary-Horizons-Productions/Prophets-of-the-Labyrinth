const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { levelUp } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

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
		if (!adventure.room.hasResource("roomAction", actionCost)) {
			interaction.reply({ content: "You don't have time to use the training dummy.", ephemeral: true });
			return;
		}

		levelUp(delver, 1, adventure);
		adventure.room.decrementResource("roomAction", actionCost);
		adventure.room.history.Trained.push(delver.name);
		interaction.update(renderRoom(adventure, interaction.channel)).then(() => {
			interaction.followUp(`${delver.name} leveled up!`);
			setAdventure(adventure);
		});
	}
);
