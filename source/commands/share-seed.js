const { PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { listifyEN } = require('../util/textUtil');

const mainId = "share-seed";
module.exports = new CommandWrapper(mainId, "Recommend this seed and Labyrinth to someone", PermissionFlagsBits.SendMessages, false, [InteractionContextType.Guild], 300000,
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (["config", "ongoing"].includes(adventure.state)) {
			interaction.reply({ content: "Please wait to recommend the seed until after the adventure is over.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const recipient = interaction.options.getUser("user");
		if (adventure.delvers.map(delver => delver.id).includes(recipient.id)) {
			interaction.reply({ content: `${recipient} was already a part of this adventure.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const partyEssences = new Set();
		for (const delver of adventure.delvers) {
			if (delver.essence && !partyEssences.has(delver.essence)) {
				partyEssences.add(delver.essence);
			}
		}
		const personalizedMessage = interaction.options.getString("personalized-message");
		recipient.send(`${interaction.member} has recommended you try a delve into the **${adventure.labyrinth}** with a seed **${adventure.initialSeed}**.${partyEssences.size > 0 ? ` Their party had the following essences: ${listifyEN([...partyEssences])}` : ""}${personalizedMessage ? `\nExtra Message: ${personalizedMessage}` : ""}`)
		interaction.reply({ content: `Delving into the **${adventure.labyrinth}** on seed **${adventure.initialSeed}** has been recommended to ${recipient}.`, flags: [MessageFlags.Ephemeral] });
	}
).setOptions(
	{
		type: "User",
		name: "user",
		description: "The user with whom to share this adventure's seed with",
		required: true
	},
	{
		type: "String",
		name: "personalized-message",
		description: "A personalized message to send with the share (like the interesting part of the seed)",
		required: false
	}
);
