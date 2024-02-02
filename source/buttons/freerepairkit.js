const { ButtonWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "freerepairkit";
module.exports = new ButtonWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources["Repair Kit"].count > 0) {
			adventure.gainItem("Repair Kit", 1);
			adventure.room.resources["Repair Kit"].count = 0;
			adventure.addResource("Repair Kit taken", "history", "internal", 1);
			interaction.update(renderRoom(adventure, interaction.message.channel)).then(() => {
				setAdventure(adventure);
			});
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
