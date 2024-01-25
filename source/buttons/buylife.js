const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { editButtons } = require('../util/messageComponentUtil');

const mainId = "buylife";
module.exports = new ButtonWrapper(mainId, 3000,
	/** -50 score, +1 life */
	(interaction, [boughtWith]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		adventure.lives++;
		if (boughtWith === "score") {
			adventure.score -= 50;
		} else {
			adventure.decrementItem("Placebo", 1);
		}
		updateRoomHeader(adventure, interaction.message).then(message => {
			let updatedUI;
			if (boughtWith === "score") {
				updatedUI = editButtons(message.components, {
					[`${mainId}${SAFE_DELIMITER}score`]: { preventUse: true, label: "+1 life", emoji: "✔️" },
					[`${mainId}${SAFE_DELIMITER}placebo`]: { preventUse: true, label: "-50 score", emoji: "✖️" }
				});
			} else {
				updatedUI = editButtons(message.components, {
					[`${mainId}${SAFE_DELIMITER}score`]: { preventUse: true, label: "-1 Placebo", emoji: "✖️" },
					[`${mainId}${SAFE_DELIMITER}placebo`]: { preventUse: true, label: "+1 life", emoji: "✔️" }
				});
			}
			interaction.update({ components: updatedUI }).then(() => {
				setAdventure(adventure);
			});
		});
	}
);
