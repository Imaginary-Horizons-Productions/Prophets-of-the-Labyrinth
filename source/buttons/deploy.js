const { ActionRowBuilder, StringSelectMenuBuilder, bold, MessageFlags, DiscordjsErrorCodes, ComponentType } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getEmoji } = require('../util/essenceUtil');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { injectApplicationEmojiMarkdown } = require('../util/graphicsUtil');

const mainId = "deploy";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select to pick an archetype */
	(interaction, args) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const archetypeOptions = [];
		for (const archetypeName in player.archetypes) {
			const archetype = getArchetype(archetypeName);
			if (archetype) {
				archetypeOptions.push({
					label: `${archetypeName} ${getEmoji(archetype.essence)}`,
					description: trimForSelectOptionDescription(`Gear: ${listifyEN(archetype.startingGear, false)}`),
					value: archetypeName
				})
			} else {
				console.error(`Attempt to deploy unregistered archtype: ${archetypeName}`);
			}
		}
		interaction.reply({
			content: `Select your archetype for this adventure!\n\nArchetypes can predict different information in combat and are countered by varying damage types based on their essence.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(`${SKIP_INTERACTION_HANDLING}archetype`)
						.setPlaceholder("Select an archetype...")
						.addOptions(archetypeOptions)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000, componentType: ComponentType.StringSelect })).then(collectedInteraction => {
			const adventure = getAdventure(interaction.channelId);
			if (adventure?.state !== "config") {
				return collectedInteraction.reply({ content: "A valid adventure could not be found.", flags: [MessageFlags.Ephemeral] });
			}

			const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const isSwitching = Boolean(delver.archetype);
			const archetype = collectedInteraction.values[0];
			delver.archetype = archetype;
			setAdventure(adventure);

			// Send confirmation text
			const { description, archetypeActionSummary } = getArchetype(archetype);
			interaction.channel.send(`${bold(interaction.user.displayName)} ${isSwitching ? "has switched to" : "will be playing as"} **${archetype}**. ${description} ${injectApplicationEmojiMarkdown(archetypeActionSummary)}`);
			return collectedInteraction.update({ components: [] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error);
			}
		}).finally(() => {
			interaction.deleteReply();
		});
	}
);
