const fs = require('fs');
const { commandFiles } = require('../commands/_commandDictionary.js');
const { CommandWrapper } = require('../classes/InteractionWrapper.js');
const { SlashCommandSubcommandBuilder, PermissionsBitField } = require('discord.js');

let text = "";

commandFiles.forEach(filename => {
	/** @type {CommandWrapper} */
	const command = require(`./../commands/${filename}`);
	text += `### /${command.customId}\n${command.data.default_member_permissions ? `> Permission Level: ${new PermissionsBitField(command.data.default_member_permissions).toArray().join(", ")}\n` : ""}\n> Usable in DMs: ${command.data.dm_permission}\n\n> Cooldown: ${command.cooldown / 1000} second(s)\n\n${command.data.description}\n`;
	for (const optionData of command.data.options) {
		let optionName = "#### ";
		if (optionData instanceof SlashCommandSubcommandBuilder) {
			optionName += `/${command.customId} ${optionData.name}\n`;
		} else {
			optionName += `${optionData.name}${optionData.required ? "" : " (optional)"}\n`;
		}
		text += optionName;
		if (optionData.choices?.length > 0) {
			text += `> Choices: \`${optionData.choices.map(choice => choice.name).join("`, `")}\`\n\n`;
		}
		text += `${optionData.description}\n`;
	}
})

fs.writeFile('wiki/Commands.md', text, (error) => {
	if (error) {
		console.error(error);
	}
});
