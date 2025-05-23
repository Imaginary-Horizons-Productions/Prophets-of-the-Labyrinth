const { MessageFlags } = require("discord.js");
const { itemExists, itemNames, getItem } = require("../../items/_itemDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getAdventure } = require("../../orcustrators/adventureOrcustrator");
const { getColor } = require("../../util/essenceUtil");
const { injectApplicationEmojiMarkdown } = require("../../util/graphicsUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("item", "Look up details on an item",
	async function executeSubcommand(interaction, ...args) {
		const itemName = interaction.options.getString("item-name");
		if (!itemExists(itemName)) {
			interaction.reply({ content: `Stats on **${itemName}** could not be found. Check for typos!`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const { name: nameInTitleCaps, essence, description, flavorText } = getItem(itemName);
		const embed = embedTemplate().setColor(getColor(essence))
			.setTitle(nameInTitleCaps)
			.setDescription(injectApplicationEmojiMarkdown(description));
		const adventure = getAdventure(interaction.channelId);
		if (adventure) {
			const numberHeld = adventure?.items[itemName] || 0;
			embed.addFields({ name: "Number Held", value: numberHeld.toString() });
		}
		if (flavorText) {
			embed.addFields(flavorText);
		}
		interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
	}
).setOptions(
	{
		type: "String",
		name: "item-name",
		description: "Input is case-insensitive",
		required: true,
		autocomplete: itemNames.map(name => ({ name, value: name }))
	}
);
