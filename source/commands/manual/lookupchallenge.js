const { CommandInteraction, MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { CHALLENGE_NAMES, getChallenge } = require("../../challenges/_challengeDictionary");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const challengeName = interaction.options.getString("challenge-name");
	const nameInTitleCaps = CHALLENGE_NAMES.find(name => name.toLowerCase() === challengeName.toLowerCase());
	if (!nameInTitleCaps) {
		interaction.reply({ content: `Could not find an challenge named ${challengeName}.`, flags: [MessageFlags.Ephemeral] });
		return;
	}

	const challengeTemplate = getChallenge(nameInTitleCaps);
	const embed = embedTemplate().setTitle(challengeTemplate.name)
		.setDescription(challengeTemplate.dynamicDescription(challengeTemplate.intensity, challengeTemplate.duration, challengeTemplate.reward, true))
		.addFields(
			{ name: "Sources", value: `Preparation Phase: ${challengeTemplate.startingChallenge ? "✅" : "🚫"}\nMysterious Challenger: ${challengeTemplate.rollableChallenge ? "✅" : "🚫"}`, inline: true },
			{ name: "Score Multiplier", value: `x${challengeTemplate.scoreMultiplier}`, inline: true }
		);
	interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
};

module.exports = {
	data: {
		name: "challenge",
		description: "Look up details on a challenge",
		optionsInput: [
			{
				type: "String",
				name: "challenge-name",
				description: "Challenges can stack; information provided is for 1 stack",
				required: true,
				autocomplete: CHALLENGE_NAMES.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
