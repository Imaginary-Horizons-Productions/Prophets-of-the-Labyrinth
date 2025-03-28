const { MAX_SET_TIMEOUT } = require("../constants");
const { Interaction, ButtonInteraction, PermissionFlagsBits, CommandInteraction, SlashCommandBuilder, AnySelectMenuInteraction, InteractionContextType, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, ContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
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

	/** returns Unix Timestamp when cooldown will expire or null in case of expired or missing cooldown
	 * @param {string} userId
	 * @param {Map<string, Map<string, number>>} cooldownMap
	 */
	getCooldownTimestamp(userId, cooldownMap) {
		const now = Date.now();

		if (!cooldownMap.has(this.mainId)) {
			cooldownMap.set(this.mainId, new Map());
		}

		const timestamps = cooldownMap.get(this.mainId);
		if (timestamps.has(userId)) {
			const expirationTime = timestamps.get(userId) + this.cooldown;

			if (now < expirationTime) {
				return Math.round(expirationTime / 1000);
			} else {
				timestamps.delete(userId);
			}
		} else {
			timestamps.set(userId, now);
			setTimeout(() => timestamps.delete(userId), this.cooldown);
		}
		return null;
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
	 * @param {InteractionContextType[]} contextEnums
	 * @param {number} cooldownInMS
	 * @param {(interaction: CommandInteraction) => void} executeFunction
	 */
	constructor(mainIdInput, descriptionInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction) {
		super(mainIdInput, cooldownInMS, executeFunction);
		this.premiumCommand = isPremiumCommand;
		this.autocomplete = {};
		this.builder = new SlashCommandBuilder()
			.setName(mainIdInput)
			.setDescription(descriptionInput)
			.setContexts(contextEnums);
		if (defaultMemberPermission) {
			this.builder.setDefaultMemberPermissions(defaultMemberPermission);
		}
	}

	/** @param {...{type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}} optionsInput */
	setOptions(...optionsInput) {
		optionsInput.forEach(option => {
			this.builder[`add${option.type}Option`](built => {
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
		return this;
	}

	/** @param {{name: string, description: string, optionsInput?: {type: "Attachment" | "Boolean" | "Channel" | "Integer" | "Mentionable" | "Number" | "Role" | "String" | "User", name: string, description: string, required: boolean, autocomplete?: {name: string, value: string}[], choices?: { name: string, value }[]}}[]} subcommandsInput */
	setSubcommands(subcommandsInput) {
		subcommandsInput.forEach(subcommand => {
			this.builder.addSubcommand(built => {
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
		return this;
	}
};

class SubcommandWrapper {
	/**
	 *
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {(interaction: CommandInteraction, ...args: unknown[]) => Promise<void>} executeFunction
	 */
	constructor(nameInput, descriptionInput, executeFunction) {
		this.data = {
			name: nameInput,
			description: descriptionInput
		};
		this.executeSubcommand = executeFunction;
	}

	/** @param  {...{ type: "", name: string, description: string, required: boolean, autocomplete?: { name: string, value: string }[], choices?: { name: string, value: string }[] } } options */
	setOptions(...options) {
		this.data.optionsInput = options;
		return this;
	}
}

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

class ContextMenuWrapper extends InteractionWrapper {
	/** Wrapper properties for general context menus. Intended to be the basis for the two child types.
	 * @param {string} mainIdInput
	 * @param {string} descriptionInput
	 * @param {PermissionFlagsBits | null} defaultMemberPermission
	 * @param {boolean} isPremiumCommand
	 * @param {InteractionContextType[]} contextEnums
	 * @param {number} cooldownInMS
	 * @param {(interaction: ContextMenuCommandInteraction) => void} executeFunction
	 */
	constructor(mainIdInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction) {
		super(mainIdInput, cooldownInMS, executeFunction);
		this.premiumCommand = isPremiumCommand;
		this.builder = new ContextMenuCommandBuilder()
			.setName(mainIdInput)
			.setContexts(contextEnums);
		if (defaultMemberPermission) {
			this.builder.setDefaultMemberPermissions(defaultMemberPermission);
		}
	}
};

class UserContextMenuWrapper extends ContextMenuWrapper {
	/** Wrapper properties for context menus on users.
	 * @param {string} mainIdInput
	 * @param {string} descriptionInput
	 * @param {PermissionFlagsBits | null} defaultMemberPermission
	 * @param {boolean} isPremiumCommand
	 * @param {InteractionContextType[]} contextEnums
	 * @param {number} cooldownInMS
	 * @param {(interaction: UserContextMenuCommandInteraction) => void} executeFunction
	 */
	constructor(mainIdInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction) {
		super(mainIdInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction);
		this.builder = this.builder.setType(ApplicationCommandType.User);
	}
};

class MessageContextMenuWrapper extends ContextMenuWrapper {
	/** Wrapper properties for context menus on messages.
	 * @param {string} mainIdInput
	 * @param {string} descriptionInput
	 * @param {PermissionFlagsBits | null} defaultMemberPermission
	 * @param {boolean} isPremiumCommand
	 * @param {InteractionContextType[]} contextEnums
	 * @param {number} cooldownInMS
	 * @param {(interaction: MessageContextMenuCommandInteraction) => void} executeFunction
	 */
	constructor(mainIdInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction) {
		super(mainIdInput, defaultMemberPermission, isPremiumCommand, contextEnums, cooldownInMS, executeFunction);
		this.builder = this.builder.setType(ApplicationCommandType.User);
	}
};

module.exports = { ButtonWrapper, CommandWrapper, SubcommandWrapper, SelectWrapper, ContextMenuWrapper, UserContextMenuWrapper, MessageContextMenuWrapper };
