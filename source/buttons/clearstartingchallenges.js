const { ButtonWrapper } = require('../classes');
const { fetchRecruitMessage, setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { generateRecruitEmbed, generateAdventureConfigMessage } = require('../util/embedUtil');

const mainId = "clearstartingchallenges";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Clears the starting challenges from the adventure, then rerenders the challenges select */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		adventure.challenges = {};
		setAdventure(adventure);
		fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(recruitMessage => {
			recruitMessage.edit({ embeds: [generateRecruitEmbed(adventure)] });
		})
		interaction.message.edit(generateAdventureConfigMessage(adventure));
		interaction.reply({ content: "Starting Challenges have been cleared for this adventure." });
	}
);
