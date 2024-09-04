const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { listifyEN } = require('../util/textUtil');

const mainId = "share-seed";
module.exports = new CommandWrapper(mainId, "Recommend this seed and Labyrinth to someone", PermissionFlagsBits.SendMessages, false, false, 300000,
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
			return;
		}

		if (["config", "ongoing"].includes(adventure.state)) {
			interaction.reply({ content: "Please wait to recommend the seed until after the adventure is over.", ephemeral: true });
			return;
		}

		const recipient = interaction.options.getUser("user");
		if (adventure.delvers.map(delver => delver.id).includes(recipient.id)) {
			interaction.reply({ content: `${recipient} was already a part of this adventure.`, ephemeral: true });
			return;
		}

		const partyElements = new Set();
		for (const delver of adventure.delvers) {
			if (delver.element && !partyElements.has(delver.element)) {
				partyElements.add(delver.element);
			}
		}
		const personalizedMessage = interaction.options.getString("personalized-message");
		recipient.send(`${interaction.member} has recommended you try a delve into the **${adventure.labyrinth}** with a seed **${adventure.initialSeed}**.${partyElements.size > 0 ? ` Their party had the following elements: ${listifyEN([...partyElements])}` : ""}${personalizedMessage ? `\nExtra Message: ${personalizedMessage}` : ""}`)
		interaction.reply({ content: `Delving into the **${adventure.labyrinth}** on seed **${adventure.initialSeed}** has been recommended to ${recipient}.`, ephemeral: true });
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
