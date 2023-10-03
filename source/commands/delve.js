const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonStyle, ChannelType, MessageFlags } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper, Adventure, Delver } = require('../classes');
const { setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getChallenge } = require('../challenges/_challengeDictionary');
const { elementsList, getColor } = require('../util/elementUtil');
const { getCompany, setCompany } = require('../orcustrators/companyOrcustrator');
const { prerollBoss, defaultLabyrinths, labyrinthExists } = require('../labyrinths/_labyrinthDictionary');
const { SAFE_DELIMITER } = require('../constants');
const { isSponsor } = require('../util/fileUtil');

const DESCRIPTORS = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future", "Intense"];

const mainId = "delve";
const options = [
	{ type: "String", name: "labyrinth", description: "The value to base the run's random events on", required: true, autocomplete: defaultLabyrinths.map(labyrinthName => ({ name: labyrinthName, value: labyrinthName })) },
	{ type: "String", name: "seed", description: "The value to base the run's random events on", required: false }
];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Start a new adventure", PermissionFlagsBits.SendMessages, false, false, 3000, options, subcommands,
	/** Start a new adventure */
	(interaction) => {
		const labyrinthName = interaction.options.getString(options[0].name);
		if (!labyrinthExists(labyrinthName)) {
			interaction.reply({ content: `There isn't a labyrinth named **${labyrinthName}** (input is case-sensitive).`, ephemeral: true });
			return;
		}

		const company = getCompany(interaction.guildId);
		if (!isSponsor(interaction.user.id) && company.adventuring.has(interaction.user.id)) {
			interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
			return;
		}

		if (interaction.channel.type !== ChannelType.GuildText) {
			interaction.reply({ content: "Please start your adventure in a text channel (threads cannot be made in thread channels).", ephemeral: true });
			return;
		}

		const adventure = new Adventure(interaction.options.getString(options[1].name), interaction.guildId, interaction.options.getString(options[0].name), interaction.user.id).generateRNTable();
		// roll bosses
		prerollBoss("Final Battle", adventure);
		prerollBoss("Artifact Guardian", adventure);

		const elementPool = elementsList();
		const pickedElement = elementPool[generateRandomNumber(adventure, elementPool.length, "general")];
		adventure.setName(`${DESCRIPTORS[generateRandomNumber(adventure, DESCRIPTORS.length, "general")]} ${labyrinthName} of ${pickedElement}`)
			.setElement(pickedElement);

		const embed = new EmbedBuilder().setColor(getColor(pickedElement))
			.setAuthor({ name: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png", url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
			.setTitle(adventure.name)
			.setThumbnail("https://cdn.discordapp.com/attachments/545684759276421120/734093574031016006/bountyboard.png")
			.setDescription("A new adventure is starting!")
			.addFields({ name: "1 Party Member", value: `${interaction.member} 👑` })
		interaction.reply({ embeds: [embed], fetchReply: true }).then(recruitMessage => {
			adventure.messageIds.recruit = recruitMessage.id;
			interaction.channel.threads.create({
				name: adventure.name,
				type: ChannelType.PrivateThread,
				invitable: true
			}).then(thread => {
				recruitMessage.edit({
					components: [new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${thread.guildId}${SAFE_DELIMITER}${thread.id}${SAFE_DELIMITER}recruit`)
							.setLabel("Join")
							.setStyle(ButtonStyle.Success)
					)]
				});
				adventure.delvers.push(new Delver(interaction.user.id, interaction.member.displayName, thread.id));
				company.adventuring.add(interaction.user.id);
				setCompany(company);

				const options = [{ label: "None", description: "Deselect previously selected challenges", value: "None" }];
				["Can't Hold All this Value", "Restless", "Rushing"].forEach(challengeName => {
					const challenge = getChallenge(challengeName);
					options.push({ label: challengeName, description: challenge.dynamicDescription(challenge.intensity, challenge.duration), value: challengeName });
				})
				adventure.setId(thread.id);
				setAdventure(adventure);
				thread.send({
					content: `This is ${interaction.member}'s new adventure. The adventure will begin when everyone clicks the "Ready!" button. Each player must select an archetype and can optionally select a starting artifact.`,
					components: [
						new ActionRowBuilder().addComponents(
							new ButtonBuilder().setCustomId("ready")
								.setLabel("Ready!")
								.setStyle(ButtonStyle.Success),
							new ButtonBuilder().setCustomId("deploy")
								.setLabel("Pick Archetype")
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder().setCustomId("viewstartingartifacts")
								.setLabel("Pick Starting Artifact")
								.setStyle(ButtonStyle.Secondary)
						),
						new ActionRowBuilder().addComponents(
							new StringSelectMenuBuilder().setCustomId("startingchallenges")
								.setPlaceholder("Select challenge(s)...")
								.setMinValues(1)
								.setMaxValues(options.length)
								.addOptions(options)
						)
					],
					flags: MessageFlags.SuppressNotifications
				});
			});
		}).catch(console.error);
	}
);
