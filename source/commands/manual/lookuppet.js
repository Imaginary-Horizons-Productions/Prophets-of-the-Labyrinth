const { bold, MessageFlags } = require("discord.js");
const { PET_NAMES } = require("../../pets/_petDictionary");
const { getPlayer } = require("../../orcustrators/playerOrcustrator");
const { generatePetEmbed } = require("../../util/embedUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("pet", "Look up details on a pet",
	async function executeSubcommand(interaction, ...args) {
		const petName = interaction.options.getString("pet-name");
		const nameInTitleCaps = PET_NAMES.find(name => name.toLowerCase() === petName.toLowerCase());
		if (!nameInTitleCaps) {
			interaction.reply({ content: `Stats on ${bold(petName)} could not be found. Check for typos!`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const player = getPlayer(interaction.user.id, interaction.guildId);
		interaction.reply({ embeds: [generatePetEmbed(nameInTitleCaps, player)], flags: [MessageFlags.Ephemeral] });
	}
).setOptions(
	{
		type: "String",
		name: "pet-name",
		description: "Pets are per server",
		required: true,
		autocomplete: PET_NAMES.map(name => ({ name, value: name }))
	}
);
