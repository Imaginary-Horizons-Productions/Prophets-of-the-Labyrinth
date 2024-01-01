const { CommandInteraction } = require("discord.js");
const { getEnemy, enemyNames } = require("../../enemies/_enemyDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji } = require("../../util/elementUtil");
const { listifyEN } = require("../../util/textUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const enemyName = interaction.options.getString("enemy-name");
	const enemyTemplate = getEnemy(enemyName);
	if (!enemyTemplate) {
		interaction.reply({ content: `Could not find an enemy named ${enemyName}.`, ephemeral: true });
		return;
	}

	const enemyEmbed = embedTemplate().setTitle(`${enemyName} ${getEmoji(enemyTemplate.element)}`)
		.setDescription(`Base HP: ${enemyTemplate.maxHP}\nSpeed: ${enemyTemplate.speed}\nCrit Rate: ${enemyTemplate.critRate}%\nPoise: ${enemyTemplate.poiseExpression}`);
	const startingModifierEntries = Object.entries(enemyTemplate.startingModifiers);
	const enemyFields = [];
	if (startingModifierEntries.length > 0) {
		enemyFields.push({ name: "Starting Modifiers", value: listifyEN(startingModifierEntries.map(([name, stacks]) => `${stacks} ${name}`)) });
	}
	enemyFields.push({
		name: "Actions",
		value: Object.values(enemyTemplate.actions).map(action => `- **${action.name}** ${getEmoji(action.element)} ${action.description}`).join("\n")
	})
	if (enemyTemplate.flavorText) {
		enemyFields.push(enemyTemplate.flavorText);
	}
	enemyEmbed.addFields(enemyFields)
	interaction.reply({ embeds: [enemyEmbed], ephemeral: true });
};

module.exports = {
	data: {
		name: "enemy-info",
		description: "Look up details on an enemy",
		optionsInput: [
			{
				type: "String",
				name: "enemy-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: enemyNames.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
