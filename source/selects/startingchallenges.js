const { EmbedBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure, fetchRecruitMessage } = require('../orcustrators/adventureOrcustrator');
const { getChallenge } = require('../challenges/_challengeDictionary');

const mainId = "startingchallenges";
module.exports = new SelectWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This adventure seems to have already ended.", ephemeral: true });
			return;
		}

		if (interaction.values.includes("None")) {
			adventure.challenges = {};
			fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(starterMessage => {
				const [{ data: starterEmbed }] = starterMessage.embeds;
				starterMessage.edit({
					embeds: [
						new EmbedBuilder({
							...starterEmbed,
							fields: starterEmbed.fields.filter(field => field.name !== "Challenges")
						})
					]
				});
			})
			interaction.reply({ content: "Starting Challenges have been cleared for this adventure." });
		} else {
			interaction.values.forEach(challengeName => {
				const challenge = getChallenge(challengeName);
				adventure.challenges[challengeName] = { intensity: challenge.intensity, duration: challenge.duration };
			})
			fetchRecruitMessage(interaction.channel, adventure.messageIds.recruit).then(starterMessage => {
				const [{ data: starterEmbed }] = starterMessage.embeds;
				const updatedEmbed = new EmbedBuilder(starterEmbed);

				const challengeField = { name: "Challenges", value: `• ${Object.keys(adventure.challenges).join("\n• ")}` };
				const fieldIndex = starterEmbed.fields.findIndex(field => field.name === "Challenges");
				if (fieldIndex !== -1) {
					updatedEmbed.spliceFields(fieldIndex, 1, challengeField)
				} else {
					updatedEmbed.addFields(challengeField);
				}
				starterMessage.edit({ embeds: [updatedEmbed] });
			})
			interaction.reply({ content: `The following challenge(s) have been added to this adventure: "${interaction.values.join("\", \"")}"` });
		}
		setAdventure(adventure);
	}
);
