const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { inspectSelfPayload } = require('../util/embedUtil');

const mainId = "inspectself";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Provide the player their combat stats */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		interaction.reply(inspectSelfPayload(delver, adventure.getGearCapacity()))
			.catch(console.error);
	}
);
