const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getEmoji } = require('../util/elementUtil');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');

const mainId = "deploy";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select to pick an archetype */
	(interaction, args) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const archetypeOptions = [];
		for (const archetypeName in player.archetypes) {
			if (player.archetypes[archetypeName] != null) {
				const archetype = getArchetype(archetypeName);
				if (archetype) {
					archetypeOptions.push({
						label: `${archetypeName} ${getEmoji(archetype.element)}`,
						description: trimForSelectOptionDescription(`Gear: ${listifyEN(archetype.startingGear)}`),
						value: archetypeName
					})
				} else {
					console.error(`Attempt to deploy unregistered archtype: ${archetypeName}`);
				}
			}
		}
		interaction.reply({
			content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and have different weaknesses and resistances based on their element.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("archetype")
						.setPlaceholder("Select an archetype...")
						.addOptions(archetypeOptions)
				)
			],
			ephemeral: true
		});
	}
);
