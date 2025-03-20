const { bold, MessageFlags } = require("discord.js");
const { generateModifierEmbed } = require("../../util/embedUtil");
const { MODIFIER_NAMES } = require("../../modifiers/_modifierDictionary");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("modifier", "Look up details on an modifier",
	async function executeSubcommand(interaction, ...args) {
		const modifierName = interaction.options.getString("modifier-name");
		const nameInTitleCaps = MODIFIER_NAMES.find(name => name.toLowerCase() === modifierName.toLowerCase());
		if (!nameInTitleCaps) {
			interaction.reply({ content: `Stats on ${bold(modifierName)} could not be found. Check for typos!`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({ embeds: [generateModifierEmbed(nameInTitleCaps, 1, 6, 0)], flags: [MessageFlags.Ephemeral] });
	}
).setOptions(
	{
		type: "String",
		name: "modifier-name",
		description: "Provides information at 1 stack",
		required: true,
		autocomplete: MODIFIER_NAMES.map(name => ({ name, value: name }))
	}
);
