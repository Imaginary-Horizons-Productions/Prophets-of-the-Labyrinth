const { CommandInteraction } = require("discord.js");
const { gearExists, getGearProperty, buildGearDescription, gearNames, injectGearStats } = require("../../gear/_gearDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji, getColor } = require("../../util/elementUtil");
const { listifyEN } = require("../../util/textUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const gearName = interaction.options.getString("gear-name");
	if (!gearExists(gearName)) {
		interaction.reply({ content: `Stats on **${gearName}** could not be found. Check for typos!`, ephemeral: true });
		return;
	}

	const fields = [
		{ name: "Category", value: getGearProperty(gearName, "category") },
		{ name: "Max Durability", value: getGearProperty(gearName, "maxDurability").toString() },
		{ name: "Base Value", value: `${getGearProperty(gearName, "cost").toString()}g` }
	];

	const upgrades = getGearProperty(gearName, "upgrades");
	if (upgrades.length > 0) {
		fields.push({ name: "Upgrades Into", value: listifyEN(upgrades, true) });
	}

	const sidegrades = getGearProperty(gearName, "sidegrades");
	if (sidegrades.length > 0) {
		fields.push({ name: "Can be Tinkered Into", value: listifyEN(sidegrades, true) });
	}

	const extraField = getGearProperty(gearName, "flavorText");
	if (extraField) {
		extraField.value = injectGearStats(extraField.value, gearName, true);
		fields.push(extraField);
	}

	const gearElement = getGearProperty(gearName, "element");
	interaction.reply({
		embeds: [
			embedTemplate().setColor(getColor(gearElement))
				.setTitle(`${getGearProperty(gearName, "name")} ${getEmoji(gearElement)}`)
				.setDescription(buildGearDescription(gearName, true))
				.addFields(fields)
		],
		ephemeral: true
	});
};

module.exports = {
	data: {
		name: "gear-info",
		description: "Look up details on a piece of gear",
		optionsInput: [
			{
				type: "String",
				name: "gear-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: gearNames.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
