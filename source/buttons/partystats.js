const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { generatePartyStatsPayload } = require('../util/embedUtil');

const mainId = "partystats";
module.exports = new ButtonWrapper(mainId, 3000,
	/** reply with the party stats embed ephemerally */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		interaction.reply(generatePartyStatsPayload(adventure));
	}
);
