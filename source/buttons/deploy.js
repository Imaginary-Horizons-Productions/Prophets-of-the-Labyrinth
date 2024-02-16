const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getEmoji } = require('../util/elementUtil');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');

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
						description: trimForSelectOptionDescription(`Gear: ${listifyEN(archetype.startingGear, false)}`),
						value: archetypeName
					})
				} else {
					console.error(`Attempt to deploy unregistered archtype: ${archetypeName}`);
				}
			}
		}
		interaction.deferReply({ ephemeral: true }).then(() => {
			return interaction.editReply({
				content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and have different weaknesses and resistances based on their element.`,
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder()
							.setCustomId(`${SKIP_INTERACTION_HANDLING}archetype`)
							.setPlaceholder("Select an archetype...")
							.addOptions(archetypeOptions)
					)
				],
				fetchReply: true
			})
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				if (adventure?.state !== "config") {
					collectedInteraction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
					return;
				}

				// Add delver to list (or overwrite)
				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const isSwitching = Boolean(delver.archetype);
				const archetype = collectedInteraction.values[0];
				delver.archetype = archetype;
				setAdventure(adventure);

				// Send confirmation text
				interaction.channel.send(`**${interaction.user.displayName}** ${isSwitching ? "has switched to" : "will be playing as"} **${archetype}**. ${getArchetype(archetype).description}`);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		});
	}
);
