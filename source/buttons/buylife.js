const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { editButtons } = require('../util/messageComponentUtil');

const mainId = "buylife";
module.exports = new ButtonWrapper(mainId, 3000,
	/** -50 score, +1 life */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		adventure.lives++;
		adventure.accumulatedScore -= 50;
		updateRoomHeader(adventure, interaction.message);
		const updatedUI = editButtons(interaction.message.components, { [interaction.customId]: { preventUse: true, label: "-50 score, +1 life", emoji: "✔️" } });
		interaction.update({ components: updatedUI }).then(() => {
			setAdventure(adventure);
		});
	}
);
