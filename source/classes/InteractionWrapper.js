const { SlashCommandBuilder } = require("@discordjs/builders");
const { MAX_SET_TIMEOUT } = require("../constants");
const { CommandInteraction } = require("discord.js");
const { BuildError } = require("./BuildError.js");

class InteractionWrapper {
	/** IHP wrapper for interaction responses
	 * @param {string} customIdInput
	 * @param {number} cooldownInMS
	 * @param {(interaction: import("discord.js").Interaction, args: string[]) => void} executeFunction
	*/
	constructor(customIdInput, cooldownInMS, executeFunction) {
		if (cooldownInMS > MAX_SET_TIMEOUT) {
			throw new BuildError("InteractionWrapper recieved cooldown argument in excess of MAX_SET_TIMEOUT");
		}
		this.customId = customIdInput;
		this.cooldown = cooldownInMS;
		this.execute = executeFunction;
	}
};

class CommandWrapper extends InteractionWrapper {
	/** Additional wrapper properties for command parsing
	 * @param {string} customIdInput
	 * @param {string} descriptionInput
	 * @param {import("discord.js").PermissionFlags | null} defaultMemberPermission
	 * @param {boolean} isPremiumCommand
	 * @param {boolean} allowInDMsInput
	 * @param {number} cooldownInMS
	 * @param {{type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}[]} optionsInput
	 * @param {{name: string, description: string, optionsInput?: {type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}}[]} subcommandsInput
	 * @param {(interaction: CommandInteraction) => void} executeFunction
	 */
	constructor(customIdInput, descriptionInput, defaultMemberPermission, isPremiumCommand, allowInDMsInput, cooldownInMS, optionsInput, subcommandsInput, executeFunction) {
		super(customIdInput, cooldownInMS, executeFunction);
		this.premiumCommand = isPremiumCommand;
		this.autocomplete = {};
		this.data = new SlashCommandBuilder()
			.setName(customIdInput)
			.setDescription(descriptionInput)
			.setDMPermission(allowInDMsInput);
		if (defaultMemberPermission) {
			this.data.setDefaultMemberPermissions(defaultMemberPermission);
		}
		optionsInput.forEach(option => {
			this.data[`add${option.type}Option`](built => {
				built.setName(option.name).setDescription(option.description).setRequired(option.required);
				if (option.autocomplete?.length > 0) {
					if (option.name in this.autocomplete) {
						throw new BuildError(`duplicate autocomplete key (${option.name})`);
					}
					built.setAutocomplete(true);
					this.autocomplete[option.name] = option.autocomplete;
				} else if (option.choices?.length > 0) {
					built.addChoices(...option.choices);
				}
				return built;
			})
		})
		subcommandsInput.forEach(subcommand => {
			this.data.addSubcommand(built => {
				built.setName(subcommand.name).setDescription(subcommand.description);
				if ("optionsInput" in subcommand) {
					subcommand.optionsInput.forEach(option => {
						built[`add${option.type}Option`](subBuilt => {
							subBuilt.setName(option.name).setDescription(option.description).setRequired(option.required);
							if (option.autocomplete?.length > 0) {
								if (option.name in this.autocomplete) {
									throw new BuildError(`duplicate autocomplete key (${option.name})`);
								}
								subBuilt.setAutocomplete(true);
								this.autocomplete[option.name] = option.autocomplete;
							} else if (option.choices?.length > 0) {
								subBuilt.addChoices(...option.choices);
							}
							return subBuilt;
						})
					})
				}
				return built;
			})
		})
	}
};

module.exports = {
	InteractionWrapper,
	CommandWrapper
};
