const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { itemExists, getItem, itemNames } = require('../items/_itemDictionary');

const customId = "manual";
const options = [];
const subcommands = [
	{
		name: "item-info",
		description: "Look up details on an item",
		optionsInput: [
			{
				type: "String",
				name: "item-name",
				description: "Input is case-sensitive",
				required: false,
				autocomplete: true
			}
		]
	}
];
module.exports = new CommandWrapper(customId, "Get information about how to play or game entities", PermissionFlagsBits.ViewChannel, false, true, 3000, options, subcommands,
	(interaction) => {
		switch (interaction.options.getSubcommand()) {
			case subcommands[0].name: // item-info
				// Returns a message containing the given consumable's game info
				const itemName = interaction.options.getString(subcommands[0].optionsInput[0].name);
				if (!itemExists(itemName)) {
					interaction.reply({ content: `Stats on **${itemName}** could not be found. Check for typos!`, ephemeral: true });
					return;
				}

				const { element, description, flavorText } = getItem(itemName);
				// const embed = embedTemplate(interaction.client.user.displayAvatarURL()).setColor(getColor(element))
				const embed = new EmbedBuilder()
					.setTitle(itemName)
					.setDescription(description);
				// const adventure = getAdventure(interaction.channelId);
				// if (adventure) {
				// 	const numberHeld = adventure?.consumables[itemName] || 0;
				// 	embed.addFields({ name: "Number Held", value: numberHeld.toString() });
				// }
				if (flavorText.length > 0) {
					embed.addFields(...flavorText);
				}
				interaction.reply({ embeds: [embed], ephemeral: true });
				break;
		}
	}
);
module.exports.autocomplete = {
	[subcommands[0].optionsInput[0].name]: itemNames.map(name => ({ name, value: name }))
};
