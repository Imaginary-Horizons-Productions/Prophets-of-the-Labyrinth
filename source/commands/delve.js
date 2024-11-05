const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, InteractionContextType, italic, userMention } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper, Adventure, Delver } = require('../classes');
const { setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getCompany, setCompany } = require('../orcustrators/companyOrcustrator');
const { prerollBoss, defaultLabyrinths, labyrinthExists, getLabyrinthProperty } = require('../labyrinths/_labyrinthDictionary');
const { SAFE_DELIMITER } = require('../constants');
const { isSponsor } = require('../util/fileUtil');
const { generateRecruitEmbed, generateAdventureConfigMessage } = require('../util/embedUtil');
const { injectApplicationEmojiMarkdown } = require('../util/graphicsUtil');

const mainId = "delve";
module.exports = new CommandWrapper(mainId, "Start a new adventure", PermissionFlagsBits.SendMessages, false, [InteractionContextType.Guild], 3000,
	/** Start a new adventure */
	(interaction) => {
		if (interaction.channel.type !== ChannelType.GuildText) {
			interaction.reply({ content: "Please start your adventure in a text channel (threads cannot be made in thread channels).", ephemeral: true });
			return;
		}

		const labyrinthName = interaction.options.getString("labyrinth");
		if (!labyrinthExists(labyrinthName)) {
			interaction.reply({ content: `There isn't a labyrinth named **${labyrinthName}** (input is case-sensitive).`, ephemeral: true });
			return;
		}

		const company = getCompany(interaction.guildId);
		if (!isSponsor(interaction.user.id) && company.adventuring.has(interaction.user.id)) {
			interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
			return;
		}

		const labyrinthNameInTitleCaps = getLabyrinthProperty(labyrinthName, "name");
		const adventure = new Adventure(interaction.options.getString("seed"), interaction.guildId, labyrinthNameInTitleCaps, interaction.user.id);
		// roll bosses
		prerollBoss("Final Battle", adventure);
		prerollBoss("Artifact Guardian", adventure);

		interaction.reply({ embeds: [generateRecruitEmbed(adventure)], fetchReply: true }).then(recruitMessage => {
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

				adventure.setId(thread.id);
				setAdventure(adventure);
				thread.send(`## ${adventure.name}\n${italic(injectApplicationEmojiMarkdown(getLabyrinthProperty(adventure.labyrinth, "description")))}\nParty Leader: ${userMention(adventure.leaderId)}`);
				thread.send(generateAdventureConfigMessage());
			});
		}).catch(console.error);
	}
).setOptions(
	{ type: "String", name: "labyrinth", description: "The value to base the run's random events on", required: true, autocomplete: defaultLabyrinths.map(labyrinthName => ({ name: labyrinthName, value: labyrinthName })) },
	{ type: "String", name: "seed", description: "The value to base the run's random events on", required: false }
);
