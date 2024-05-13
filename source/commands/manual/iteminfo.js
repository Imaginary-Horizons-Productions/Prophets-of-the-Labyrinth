const { CommandInteraction } = require("discord.js");
const { itemExists, itemNames, getItem } = require("../../items/_itemDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getAdventure } = require("../../orcustrators/adventureOrcustrator");
const { getColor } = require("../../util/elementUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const itemName = interaction.options.getString("item-name");
	if (!itemExists(itemName)) {
		interaction.reply({ content: `Stats on **${itemName}** could not be found. Check for typos!`, ephemeral: true });
		return;
	}

	const { name: nameInTitleCaps, element, description, flavorText } = getItem(itemName);
	const embed = embedTemplate().setColor(getColor(element))
		.setTitle(nameInTitleCaps)
		.setDescription(description);
	const adventure = getAdventure(interaction.channelId);
	if (adventure) {
		const numberHeld = adventure?.items[itemName] || 0;
		embed.addFields({ name: "Number Held", value: numberHeld.toString() });
	}
	if (flavorText) {
		embed.addFields(flavorText);
	}
	interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports = {
	data: {
		name: "item-info",
		description: "Look up details on an item",
		optionsInput: [
			{
				type: "String",
				name: "item-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: itemNames.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
