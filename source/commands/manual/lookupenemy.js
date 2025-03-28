const { MessageFlags } = require("discord.js");
const { getEnemy, enemyNames } = require("../../enemies/_enemyDictionary");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji } = require("../../util/essenceUtil");
const { listifyEN } = require("../../util/textUtil");
const { injectApplicationEmojiMarkdown } = require("../../util/graphicsUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("enemy", "Look up details on an enemy",
	async function executeSubcommand(interaction, ...args) {
		const enemyName = interaction.options.getString("enemy-name");
		const enemyTemplate = getEnemy(enemyName);
		if (!enemyTemplate) {
			interaction.reply({ content: `Could not find an enemy named ${enemyName}.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const enemyEmbed = embedTemplate().setTitle(`${enemyTemplate.name} ${getEmoji(enemyTemplate.essence)}`)
			.setDescription(`Base HP: ${enemyTemplate.maxHP}\nSpeed: ${enemyTemplate.speed}\nCritical Rate: ${enemyTemplate.critRate}%\nStagger Capacity: ${enemyTemplate.staggerCapExpression}\n-# In these formulae, "n" is the party size (if it appears).`);
		const startingModifierEntries = Object.entries(enemyTemplate.startingModifiers);
		const enemyFields = [];
		if (startingModifierEntries.length > 0) {
			enemyFields.push({ name: "Starting Modifiers", value: listifyEN(startingModifierEntries.map(([name, stacks]) => `${stacks} ${name}`), false) });
		}
		enemyFields.push({
			name: "Actions",
			value: Object.values(enemyTemplate.actions).map(action => `- **${action.name}** ${getEmoji(action.essence)} ${injectApplicationEmojiMarkdown(action.description)}`).join("\n")
		})
		if (enemyTemplate.flavorText) {
			enemyFields.push({ name: enemyTemplate.flavorText.name, value: injectApplicationEmojiMarkdown(enemyTemplate.flavorText.value) });
		}
		enemyEmbed.addFields(enemyFields)
		interaction.reply({ embeds: [enemyEmbed], flags: [MessageFlags.Ephemeral] });
	}
).setOptions(
	{
		type: "String",
		name: "enemy-name",
		description: "Input is case-insensitive",
		required: true,
		autocomplete: enemyNames.map(name => ({ name, value: name }))
	}
);
