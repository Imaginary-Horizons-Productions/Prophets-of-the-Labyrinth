const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure, fetchRecruitMessage } = require('../orcustrators/adventureOrcustrator');
const { getChallenge } = require('../challenges/_challengeDictionary');
const { generateRecruitEmbed } = require('../util/embedUtil');
const { MessageFlags } = require('discord.js');

const mainId = "startingchallenges";
module.exports = new SelectWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This adventure seems to have already ended.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.values.forEach(challengeName => {
			const challenge = getChallenge(challengeName);
			adventure.challenges[challengeName] = { intensity: challenge.intensity, duration: challenge.duration, reward: challenge.reward };
		})
		fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(recruitMessage => {
			recruitMessage.edit({ embeds: [generateRecruitEmbed(adventure)] });
		})
		interaction.reply({ content: `The following challenge(s) have been added to this adventure: "${interaction.values.join("\", \"")}"` });
		setAdventure(adventure);
	}
);
