const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS } = require('../constants');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { inspectSelfPayload, randomAuthorTip } = require('../util/embedUtil');
const { getColor } = require('../util/elementUtil');

const mainId = "adventure";
const options = [];
const subcommands = [
	{
		name: "party-stats",
		description: "Get info about the current adventure"
	},
	{
		name: "inspect-self",
		description: "🔎 Get your adventure-specific stats"
	}
];
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000, options, subcommands,
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		switch (interaction.options.getSubcommand()) {
			case subcommands[0].name: // party-stats
				const guardsScouted = adventure.artifactGuardians.slice(0, adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians);
				const embed = new EmbedBuilder().setColor(getColor(adventure.element))
					.setAuthor(randomAuthorTip())
					.setTitle(`Party Stats - ${adventure.name}`)
					.setDescription(`Depth: ${adventure.depth}`)
					.addFields([
						{ name: `${adventure.lives} Lives Remaining`, value: "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end." },
						{ name: `${adventure.gold} Gold`, value: "Gold is exchanged for goods and services within adventures. Gold *will be lost when an adventure ends*." },
						{ name: "Items", value: Object.keys(adventure.items).map(item => `${item} x ${adventure.items[item]}`).join("\n") || "None" },
						{
							name: "Scouting",
							value: `Final Battle: ${adventure.scouting.finalBoss ? adventure.finalBoss : "???"}\nArtifact Guardians: ${guardsScouted.length > 0 ?
								guardsScouted.map((encounter, index) => {
									if (index + 1 <= adventure.scouting.artifactGuardiansEncountered) {
										return `~~${encounter}~~`;
									} else {
										return encounter;
									}
								}).join(", ") + "..." : "???"}`
						}
					]);
				const challenges = Object.keys(adventure.challenges);
				if (challenges.length) {
					embed.addFields({ name: "Challenges", value: Object.keys(adventure.challenges).join(", ") });
				}
				const infoSelects = [];
				const allArtifacts = Object.keys(adventure.artifacts);
				const artifactPages = [];
				for (let i = 0; i < allArtifacts.length; i += MAX_SELECT_OPTIONS) {
					artifactPages.push(allArtifacts.slice(i, i + MAX_SELECT_OPTIONS));
				}
				if (artifactPages.length > 0) {
					embed.addFields({ name: "Artifacts", value: Object.entries(adventure.artifacts).map(entry => `${entry[0]} x ${entry[1].count}`).join(", ") })
					infoSelects.push(...artifactPages.slice(0, MAX_MESSAGE_ACTION_ROWS).map((page, index) =>
						new ActionRowBuilder().addComponents(
							new StringSelectMenuBuilder().setCustomId(`artifact${SAFE_DELIMITER}${index}`)
								.setPlaceholder(`Get details about an artifact...${artifactPages.length > 1 ? ` (Page ${index + 1})` : ""}`)
								.setOptions(page.map(artifact => ({
									label: `${artifact} x ${adventure.artifacts[artifact].count}`,
									value: `${artifact}${SAFE_DELIMITER}${adventure.artifacts[artifact].count}`
								})
								))
						)
					))
				} else {
					infoSelects.push(new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`artifact`)
							.setPlaceholder("No artifacts to inspect...")
							.setDisabled(true)
							.setOptions([{
								label: "placeholder",
								value: "placeholder"
							}])
					))
				}
				interaction.reply({ embeds: [embed], components: infoSelects, ephemeral: true })
					.catch(console.error);
				break;
			case subcommands[1].name: // inspect-self
				interaction.reply(inspectSelfPayload(delver, adventure.getGearCapacity()))
					.catch(console.error);
				break;
		}
	}
);
