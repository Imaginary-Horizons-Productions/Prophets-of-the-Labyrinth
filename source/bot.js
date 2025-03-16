const log = console.log;

console.log = function () {
	log.apply(console, [`<t:${Math.floor(Date.now() / 1000)}> `, ...arguments]);
}

const error = console.error;

console.error = function () {
	error.apply(console, [`<t:${Math.floor(Date.now() / 1000)}> `, ...arguments]);
}

//#region Imports
const { REST, Routes, Client, ActivityType, IntentsBitField, Events, MessageFlags } = require("discord.js");
const { readFile, writeFile } = require("fs").promises;

const { Company } = require("./classes");
const { SAFE_DELIMITER, authPath, testGuildId, announcementsChannelId, lastPostedVersion, SKIP_INTERACTION_HANDLING, commandIds } = require("./constants.js");

const { getCommand, slashData } = require("./commands/_commandDictionary.js");
const { contextMenuData, getContextMenu } = require("./context_menus/_contextMenuDictionary.js");
const { getButton } = require("./buttons/_buttonDictionary.js");
const { getModifierEmojiFileTuples } = require("./modifiers/_modifierDictionary.js");
const { getSelect } = require("./selects/_selectDictionary.js");

const { generateVersionEmbed } = require("./util/embedUtil.js");
const { setApplicationEmojiDictionary } = require("./util/graphicsUtil.js");

const { loadAdventures } = require("./orcustrators/adventureOrcustrator.js");
const { loadCompanies, setCompany } = require("./orcustrators/companyOrcustrator.js");
const { loadPlayers } = require("./orcustrators/playerOrcustrator.js");
//#endregion

//#region Executing Code
const client = new Client({
	retryLimit: 5,
	presence: {
		activities: [{
			type: ActivityType.Listening,
			name: "/commands"
		}]
	},
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers]
});
/** @type {Map<string, Map<string, number>>} */
const interactionCooldowns = new Map();

client.login(require(authPath).token)
	.catch(console.error);

(async () => {
	try {
		console.log(await loadPlayers());
		console.log(await loadCompanies());
		console.log(await loadAdventures());
		client.login(require("../config/auth.json").token);
	} catch (rejectMessage) {
		console.error(rejectMessage);
	}
})()
//#endregion

//#region Event Handlers
client.on(Events.ClientReady, () => {
	console.log(`Connected as ${client.user.tag}`);

	//Upload Emoji
	client.application.emojis.fetch().then(async existingEmojis => {
		const emojiMap = {};
		await Promise.all(getModifierEmojiFileTuples().map(async ([name, attachment]) => {
			const existingEmoji = existingEmojis.find(emoji => emoji.name === name);
			if (existingEmoji) {
				emojiMap[existingEmoji.name] = existingEmoji.id;
			} else {
				const createdEmoji = await client.application.emojis.create({ name, attachment });
				emojiMap[createdEmoji.name] = createdEmoji.id;
			}
		}))
		setApplicationEmojiDictionary(emojiMap);
	})

	if (process.argv[4] === "prod") {
		// Upload Slash Commands
		(() => {
			try {
				new REST({ version: 10 }).setToken(require(authPath).token).put(
					Routes.applicationCommands(client.user.id),
					{ body: slashData.concat(contextMenuData) }
				).then(commands => {
					for (const command of commands) {
						commandIds[command.name] = command.id;
					}
				})
			} catch (error) {
				console.error(error);
			}
		})()

		// Post Changelog
		readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
			let [currentFull, currentMajor, currentMinor, currentPatch] = data.match(/(\d+)\.(\d+)\.(\d+)/);
			let [_lastFull, lastMajor, lastMinor, lastPatch] = lastPostedVersion.match(/(\d+)\.(\d+)\.(\d+)/);

			if (parseInt(currentMajor) <= parseInt(lastMajor)) {
				if (parseInt(currentMinor) <= parseInt(lastMinor)) {
					if (parseInt(currentPatch) <= parseInt(lastPatch)) {
						return;
					}
				}
			}

			generateVersionEmbed().then(embed => {
				client.guilds.fetch(testGuildId).then(guild => {
					guild.channels.fetch(announcementsChannelId).then(announcementsChannel => {
						announcementsChannel.send({ embeds: [embed] }).then(message => {
							message.crosspost();
							writeFile('./config/versionData.json', JSON.stringify({
								announcementsChannelId,
								lastPostedVersion: currentFull,
							}), "utf-8");
						});
					})
				})
			}).catch(console.error);
		});
	} else {
		client.application.commands.fetch({ guildId: testGuildId }).then(commands => {
			commands.each(command => {
				commandIds[command.name] = command.id;
			})
		});
	}
})

client.on(Events.InteractionCreate, interaction => {
	if (interaction.customId?.startsWith(SKIP_INTERACTION_HANDLING)) {
		return;
	}

	if (interaction.isAutocomplete()) {
		const command = getCommand(interaction.commandName);
		const focusedOption = interaction.options.getFocused(true);
		const unfilteredChoices = command.autocomplete?.[focusedOption.name] ?? [];
		if (unfilteredChoices.length < 1) {
			console.error(`Attempted autocomplete on misconfigured command ${interaction.commandName} ${focusedOption.name}`);
		}
		const choices = unfilteredChoices.filter(choice => choice.value.toLowerCase().includes(focusedOption.value.toLowerCase()))
			.slice(0, 25);
		interaction.respond(choices);
	} else if (interaction.isContextMenuCommand()) {
		const contextMenu = getContextMenu(interaction.commandName);
		const cooldownTimestamp = contextMenu.getCooldownTimestamp(interaction.user.id, interactionCooldowns);
		if (cooldownTimestamp) {
			interaction.reply({ content: `Please wait, the \`/${interaction.commandName}\` context menu option is on cooldown. It can be used again <t:${cooldownTimestamp}:R>.`, flags: [MessageFlags.Ephemeral] });
			return;
		}
		contextMenu.execute(interaction);
	} else if (interaction.isCommand()) {
		const command = getCommand(interaction.commandName);
		const cooldownTimestamp = command.getCooldownTimestamp(interaction.user.id, interactionCooldowns);
		if (cooldownTimestamp) {
			interaction.reply({ content: `Please wait, the \`/${interaction.commandName}\` command is on cooldown. It can be used again <t:${cooldownTimestamp}:R>.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		command.execute(interaction);
	} else {
		const [mainId, ...args] = interaction.customId.split(SAFE_DELIMITER);
		let getter;
		if (interaction.isButton()) {
			getter = getButton;
		} else if (interaction.isAnySelectMenu()) {
			getter = getSelect;
		}
		const interactionWrapper = getter(mainId);
		if (interactionWrapper === undefined) {
			console.error(`Got undefined for ${mainId} (check dictionary/name?)`)
			return
		}
		const cooldownTimestamp = interactionWrapper.getCooldownTimestamp(interaction.user.id, interactionCooldowns);

		if (cooldownTimestamp) {
			interaction.reply({ content: `Please wait, this interaction is on cooldown. It can be used again <t:${cooldownTimestamp}:R>.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		interactionWrapper.execute(interaction, args);
	}
})

client.on(Events.GuildCreate, guild => {
	setCompany(new Company(guild.id));
})
//#endregion
