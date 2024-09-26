const fs = require('fs');
const { commandFiles } = require('../commands/_commandDictionary.js');
const { CommandWrapper } = require('../classes');
const { SlashCommandSubcommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');
const { listifyEN } = require('../util/textUtil.js');

let text = "";

commandFiles.forEach(filename => {
	/** @type {CommandWrapper} */
	const command = require(`./../commands/${filename}`);
	text += `## /${command.mainId}\n`;
	const contextDictionary = {
		[InteractionContextType.BotDM]: "DMs",
		[InteractionContextType.Guild]: "Servers",
		[InteractionContextType.PrivateChannel]: "Group DMs"
	}
	text += `> Usable in: ${listifyEN(command.builder.contexts.map(context => contextDictionary[context]))}\n\n`;
	if (command.cooldown === 1000) {
		text += `> Cooldown: 1 second\n\n`;
	} else {
		text += `> Cooldown: ${command.cooldown / 1000} seconds\n\n`
	}
	if (command.builder.default_member_permissions) {
		text += `> Permission Level: ${new PermissionsBitField(command.builder.default_member_permissions).toArray().join(", ")}\n\n`;
	}
	if (!command.builder.options[0] || !(command.builder.options[0] instanceof SlashCommandSubcommandBuilder)) {
		text += `${command.builder.description}\n`;
	}
	for (const optionData of command.builder.options) {
		let optionName = "### ";
		if (optionData instanceof SlashCommandSubcommandBuilder) {
			optionName += `/${command.mainId} ${optionData.name}\n`;
		} else {
			if (optionData.required) {
				optionName += `${optionData.name}\n`;
			} else {
				optionName += `${optionData.name} (optional)\n`;
			}
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
