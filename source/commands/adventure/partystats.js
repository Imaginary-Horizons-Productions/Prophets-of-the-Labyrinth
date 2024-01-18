const { CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Adventure } = require("../../classes");
const { randomAuthorTip } = require("../../util/embedUtil");
const { getColor } = require("../../util/elementUtil");
const { listifyEN } = require("../../util/textUtil");
const { EMPTY_SELECT_OPTION_SET, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS, SAFE_DELIMITER } = require("../../constants");

/**
 * @param {CommandInteraction} interaction
 * @param {[Adventure]} args
 */
async function executeSubcommand(interaction, ...[adventure]) {
	const guardsScouted = adventure.artifactGuardians.slice(0, adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians);
	const gearCapacity = adventure.getGearCapacity();
	const embed = new EmbedBuilder().setColor(getColor(adventure.element))
		.setAuthor(randomAuthorTip())
		.setTitle(`Party Stats - ${adventure.name}`)
		.setDescription(`Depth: ${adventure.depth}\nScore: ${adventure.getBaseScore().total}`)
		.addFields([
			{ name: `${adventure.lives} Lives Remaining`, value: "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end." },
			{ name: `${adventure.gold} Gold`, value: `Gold is exchanged for goods and services within adventures. *Gold will be lost when an adventure ends.*\nPeak Gold: ${adventure.peakGold}` },
			{ name: `Gear Capacity: ${gearCapacity}`, value: `Each delver can carry ${gearCapacity} pieces of gear. Gear capacity can be increased at Tanning Workshops and by the Hammerspace Holster artifact.` },
			{ name: "Items", value: Object.keys(adventure.items).map(item => `${item} x ${adventure.items[item]}`).join("\n") || "None" },
			{
				name: "Scouting",
				value: `Final Battle: ${adventure.scouting.bosses.length > 0 ? adventure.bosses[0] : "???"}\nArtifact Guardians: ${guardsScouted.length > 0 ?
					listifyEN(guardsScouted.map((encounter, index) => {
						if (index + 1 <= adventure.scouting.artifactGuardiansEncountered) {
							return `~~${encounter}~~`;
						} else {
							return encounter;
						}
					})) + "..." : "???"}`
			}
		]);
	const challenges = Object.keys(adventure.challenges);
	if (challenges.length) {
		embed.addFields({ name: "Challenges", value: listifyEN(Object.keys(adventure.challenges)) });
	}
	const infoSelects = [];
	const allArtifacts = Object.keys(adventure.artifacts);
	const artifactPages = [];
	for (let i = 0; i < allArtifacts.length; i += MAX_SELECT_OPTIONS) {
		artifactPages.push(allArtifacts.slice(i, i + MAX_SELECT_OPTIONS));
	}
	if (artifactPages.length > 0) {
		embed.addFields({ name: "Artifacts", value: listifyEN(Object.entries(adventure.artifacts).map(entry => `${entry[0]} x ${entry[1].count}`)) })
		infoSelects.push(...artifactPages.slice(0, MAX_MESSAGE_ACTION_ROWS).map((page, index) =>
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`artifact${SAFE_DELIMITER}${index}`)
					.setPlaceholder(`Get details about an artifact...${artifactPages.length > 1 ? ` (Page ${index + 1})` : ""}`)
					.setOptions(page.map(artifact => {
						const count = adventure.getArtifactCount(artifact);
						return {
							label: `${artifact} x ${count}`,
							value: `${artifact}${SAFE_DELIMITER}${count}`
						};
					}))
			)
		))
	} else {
		infoSelects.push(new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`artifact`)
				.setPlaceholder("No artifacts to inspect...")
				.setDisabled(true)
				.setOptions(EMPTY_SELECT_OPTION_SET)
		))
	}
	interaction.reply({ embeds: [embed], components: infoSelects, ephemeral: true })
		.catch(console.error);
};

module.exports = {
	data: {
		name: "party-stats",
		description: "Get info about the current adventure"
	},
	executeSubcommand
};
