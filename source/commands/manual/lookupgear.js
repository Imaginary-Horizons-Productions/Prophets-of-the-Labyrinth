const { CommandInteraction, MessageFlags, italic } = require("discord.js");
const { gearExists, getGearProperty, buildGearDescription, GEAR_NAMES } = require("../../gear/_gearDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji, getColor } = require("../../util/essenceUtil");
const { listifyEN } = require("../../util/textUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const gearName = interaction.options.getString("gear-name");
	if (!gearExists(gearName)) {
		interaction.reply({ content: `Stats on **${gearName}** could not be found. Check for typos!`, flags: [MessageFlags.Ephemeral] });
		return;
	}

	const fields = [
		{ name: "Category", value: getGearProperty(gearName, "category"), inline: true },
	];

	const cost = getGearProperty(gearName, "cost");
	if (cost) {
		fields.push({ name: "Base Value", value: `${cost.toString()}g`, inline: true });
	}

	const upgrades = getGearProperty(gearName, "upgrades");
	if (upgrades.length > 0) {
		fields.push({ name: "Upgrades Into", value: listifyEN(upgrades.map(upgrade => italic(upgrade)), true) });
	}

	const sidegrades = getGearProperty(gearName, "sidegrades");
	if (sidegrades.length > 0) {
		fields.push({ name: "Modifies Into", value: listifyEN(sidegrades.map(sidegrade => italic(sidegrade)), true) });
	}

	const extraField = getGearProperty(gearName, "flavorText");
	if (extraField) {
		fields.push(extraField);
	}

	const gearEssence = getGearProperty(gearName, "essence");
	interaction.reply({
		embeds: [
			embedTemplate().setColor(getColor(gearEssence))
				.setTitle(`${getGearProperty(gearName, "name")} ${getEmoji(gearEssence)}`)
				.setDescription(buildGearDescription(gearName, true))
				.addFields(fields)
		],
		flags: [MessageFlags.Ephemeral]
	});
};

module.exports = {
	data: {
		name: "gear",
		description: "Look up details on a piece of gear",
		optionsInput: [
			{
				type: "String",
				name: "gear-name",
				description: "Input is case-insensitive",
				required: true,
				autocomplete: GEAR_NAMES.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
