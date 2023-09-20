const { MAX_SET_TIMEOUT } = require("../constants");
const { Interaction, ButtonInteraction, PermissionFlagsBits, CommandInteraction, SlashCommandBuilder, AnySelectMenuInteraction } = require("discord.js");
const { BuildError } = require("./BuildError.js");

class InteractionWrapper {
	/** IHP wrapper for interaction responses
	 * @param {string} mainIdInput
	 * @param {number} cooldownInMS
	 * @param {(interaction: Interaction, args: string[]) => void} executeFunction
	*/
	constructor(mainIdInput, cooldownInMS, executeFunction) {
		if (cooldownInMS > MAX_SET_TIMEOUT) {
			throw new BuildError("InteractionWrapper recieved cooldown argument in excess of MAX_SET_TIMEOUT");
		}
		this.mainId = mainIdInput;
		this.cooldown = cooldownInMS;
		this.execute = executeFunction;
	}
};

class ButtonWrapper extends InteractionWrapper {
	/** IHP wrapper for button responses
	 * @param {string} mainIdInput
	 * @param {number} cooldownInMS
	 * @param {(interaction: ButtonInteraction, args: string[]) => void} executeFunction
	 */
	constructor(mainIdInput, cooldownInMS, executeFunction) {
		super(mainIdInput, cooldownInMS, executeFunction);
	}
};

class CommandWrapper extends InteractionWrapper {
	/** Additional wrapper properties for command parsing
	 * @param {string} mainIdInput
	 * @param {string} descriptionInput
	 * @param {PermissionFlagsBits | null} defaultMemberPermission
	 * @param {boolean} isPremiumCommand
	 * @param {boolean} allowInDMsInput
	 * @param {number} cooldownInMS
	 * @param {{type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}[]} optionsInput
	 * @param {{name: string, description: string, optionsInput?: {type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}}[]} subcommandsInput
	 * @param {(interaction: CommandInteraction) => void} executeFunction
	 */
	constructor(mainIdInput, descriptionInput, defaultMemberPermission, isPremiumCommand, allowInDMsInput, cooldownInMS, optionsInput, subcommandsInput, executeFunction) {
		super(mainIdInput, cooldownInMS, executeFunction);
		this.premiumCommand = isPremiumCommand;
		this.autocomplete = {};
		this.builder = new SlashCommandBuilder()
			.setName(mainIdInput)
			.setDescription(descriptionInput)
			.setDMPermission(allowInDMsInput);
		if (defaultMemberPermission) {
			this.builder.setDefaultMemberPermissions(defaultMemberPermission);
		}
		optionsInput.forEach(option => {
			this.builder[`add${option.type}Option`](built => {
				built.setName(option.name).setDescription(option.description).setRequired(option.required);
				if (option.autocomplete?.length > 0) {
					if (option.name in this.autocomplete) {
						throw new BuildError(`duplicate autocomplet key (${option.name})`);
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
			this.builder.addSubcommand(built => {
				built.setName(subcommand.name).setDescription(subcommand.description);
				if ("optionsInput" in subcommand) {
					subcommand.optionsInput.forEach(option => {
						built[`add${option.type}Option`](subBuilt => {
							subBuilt.setName(option.name).setDescription(option.description).setRequired(option.required);
							if (option.autocomplete?.length > 0) {
								if (option.name in this.autocomplete) {
									throw new BuildError(`duplicate autocomplet key (${option.name})`);
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

class SelectWrapper extends InteractionWrapper {
	/** IHP wrapper for any select responses
	 * @param {string} mainIdInput
	 * @param {number} cooldownInMS
	 * @param {(interaction: AnySelectMenuInteraction, args: string[]) => void} executeFunction
	 */
	constructor(mainIdInput, cooldownInMS, executeFunction) {
		super(mainIdInput, cooldownInMS, executeFunction);
	}
};

module.exports = { InteractionWrapper, ButtonWrapper, CommandWrapper, SelectWrapper };
