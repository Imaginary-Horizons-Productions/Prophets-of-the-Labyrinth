const { CommandInteraction, bold } = require("discord.js");
const { PET_NAMES } = require("../../pets/_petDictionary");
const { getPlayer } = require("../../orcustrators/playerOrcustrator");
const { generatePetEmbed } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const petName = interaction.options.getString("pet-name");
	const nameInTitleCaps = PET_NAMES.find(name => name.toLowerCase() === petName.toLowerCase());
	if (!nameInTitleCaps) {
		interaction.reply({ content: `Stats on ${bold(petName)} could not be found. Check for typos!`, ephemeral: true });
		return;
	}

	const player = getPlayer(interaction.user.id, interaction.guildId);
	interaction.reply({ embeds: [generatePetEmbed(nameInTitleCaps, player)], ephemeral: true });
};

module.exports = {
	data: {
		name: "pet-info",
		description: "Look up details on a pet",
		optionsInput: [
			{
				type: "String",
				name: "pet-name",
				description: "Pets are per server",
				required: true,
				autocomplete: PET_NAMES.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
