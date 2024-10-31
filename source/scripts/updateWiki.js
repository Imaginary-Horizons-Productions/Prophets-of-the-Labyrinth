const fs = require('fs');
const { commandFiles } = require('../commands/_commandDictionary.js');
const { contextMenuFiles } = require('../context_menus/_contextMenuDictionary.js');
const { CommandWrapper, ContextMenuWrapper } = require('../classes');
const { SlashCommandSubcommandBuilder, PermissionsBitField, InteractionContextType, ApplicationCommandType } = require('discord.js');
const { listifyEN } = require('../util/textUtil.js');

const contextDictionary = {
	[InteractionContextType.BotDM]: "DMs",
	[InteractionContextType.Guild]: "Servers",
	[InteractionContextType.PrivateChannel]: "Group DMs"
}

let text = "";

if (commandFiles.length > 0) {
	text += "## Slash Commands\n";
	commandFiles.forEach(filename => {
		/** @type {CommandWrapper} */
		const command = require(`./../commands/${filename}`);
		text += `### /${command.mainId}\n`;
		if (command.premiumCommand) {
			text += `> 💎 Premium Command 💎\n\n`
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
			let optionName = "#### ";
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
}

if (contextMenuFiles.length > 0) {
	text += "## Context Menu Options\n";
	for (const file of contextMenuFiles) {
		/** @type {ContextMenuWrapper} */
		const contextMenu = require(`./../context_menus/${file}`);
		text += `### ${contextMenu.builder.type === ApplicationCommandType.User ? "User -> Apps" : "Message -> Apps"} -> ${contextMenu.mainId}\n`;
		if (contextMenu.premiumCommand) {
			text += `> 💎 Premium Feature 💎\n\n`
		}
		text += `> Usable in: ${listifyEN(contextMenu.builder.contexts.map(context => contextDictionary[context]))}\n\n`;
		if (contextMenu.cooldown === 1000) {
			text += `> Cooldown: 1 second\n\n`;
		} else {
			text += `> Cooldown: ${contextMenu.cooldown / 1000} seconds\n\n`
		}
		if (contextMenu.builder.default_member_permissions) {
			text += `> Permission Level: ${new PermissionsBitField(contextMenu.builder.default_member_permissions).toArray().join(", ")}\n\n`;
		}
	}
}

fs.writeFile('wiki/Commands.md', text, (error) => {
	if (error) {
		console.error(error);
	}
});
