const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "buylife";
module.exports = new ButtonWrapper(mainId, 3000,
	/** exchange resource in arguments for a life */
	(interaction, [boughtWith]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		adventure.lives++;
		adventure.room.history["Traded for Flask"].push(boughtWith)
		if (boughtWith === "score") {
			adventure.score -= 50;
		} else {
			adventure.decrementItem("Placebo", 1);
		}
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
	}
);
