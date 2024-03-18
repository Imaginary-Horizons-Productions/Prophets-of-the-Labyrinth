const log = console.log;

console.log = function () {
	log.apply(console, [`<t:${Math.floor(Date.now() / 1000)}> `, ...arguments]);
}

const error = console.error;

console.error = function () {
	error.apply(console, [`<t:${Math.floor(Date.now() / 1000)}> `, ...arguments]);
}

//#region Imports
const { REST, Routes, Client, ActivityType, IntentsBitField, Events } = require("discord.js");
const { readFile, writeFile } = require("fs").promises;

const { Company } = require("./classes");
const { SAFE_DELIMITER, authPath, testGuildId, announcementsChannelId, lastPostedVersion, SKIP_INTERACTION_HANDLING, commandIds } = require("./constants.js");

const { loadCompanies, setCompany } = require("./orcustrators/companyOrcustrator.js");
const { loadAdventures } = require("./orcustrators/adventureOrcustrator.js");
const { loadPlayers } = require("./orcustrators/playerOrcustrator.js");

const { getCommand, slashData } = require("./commands/_commandDictionary.js");
const { getButton } = require("./buttons/_buttonDictionary.js");
const { getSelect } = require("./selects/_selectDictionary.js");

const { generateVersionEmbed } = require("./util/embedUtil.js");
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
		console.log(await loadCompanies());
		console.log(await loadAdventures());
		console.log(await loadPlayers());
		client.login(require("../config/auth.json").token);
	} catch (rejectMessage) {
		console.error(rejectMessage);
	}
})()
//#endregion

//#region Event Handlers
client.on(Events.ClientReady, () => {
	console.log(`Connected as ${client.user.tag}`);

	if (process.argv[4] === "prod") {
		(() => {
			try {
				new REST({ version: 9 }).setToken(require(authPath).token).put(
					Routes.applicationCommands(client.user.id),
					{ body: slashData }
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
	if (interaction.isAutocomplete()) {
		const command = getCommand(interaction.commandName);
		const focusedOption = interaction.options.getFocused(true);
		const unfilteredChoices = command.autocomplete?.[focusedOption.name] ?? [];
		if (unfilteredChoices.length < 1) {
			console.error(`Attempted autocomplete on misconfigured command ${interaction.commandName} ${focusedOption.name}`);
		}
		const choices = unfilteredChoices.filter(choice => choice.value.includes(focusedOption.value))
			.slice(0, 25);
		interaction.respond(choices);
	} else if (interaction.isCommand()) {
		const command = getCommand(interaction.commandName);
		const cooldownTimestamp = command.getCooldownTimestamp(interaction.user.id, interactionCooldowns);
		if (cooldownTimestamp) {
			interaction.reply({ content: `Please wait, the \`/${interaction.commandName}\` command is on cooldown. It can be used again <t:${cooldownTimestamp}:R>.`, ephemeral: true });
			return;
		}

		command.execute(interaction);
	} else if (interaction.customId.startsWith(SKIP_INTERACTION_HANDLING)) {
		return;
	} else {
		const [mainId, ...args] = interaction.customId.split(SAFE_DELIMITER);
		let getter;
		if (interaction.isButton()) {
			getter = getButton;
		} else if (interaction.isAnySelectMenu()) {
			getter = getSelect;
		}
		const interactionWrapper = getter(mainId);
		const cooldownTimestamp = interactionWrapper.getCooldownTimestamp(interaction.user.id, interactionCooldowns);

		if (cooldownTimestamp) {
			interaction.reply({ content: `Please wait, this interaction is on cooldown. It can be used again <t:${cooldownTimestamp}:R>.`, ephemeral: true });
			return;
		}

		interactionWrapper.execute(interaction, args);
	}
})

client.on(Events.GuildCreate, guild => {
	setCompany(new Company(guild.id));
})
//#endregion
