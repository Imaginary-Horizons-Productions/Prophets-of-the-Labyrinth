const { ActionRowBuilder, StringSelectMenuBuilder, bold, MessageFlags, DiscordjsErrorCodes, ComponentType } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArchetype, getArchetypeActionName } = require('../archetypes/_archetypeDictionary');
const { renderRoom } = require('../util/embedUtil');
const { buildGearDescription } = require('../gear/_gearDictionary');

const mainId = "switchspecialization";
module.exports = new ButtonWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const specializationsDescriptions = [];
		const specializationOptions = [];
		for (const specialization of getArchetype(delver.archetype).specializations.slice(0, player.archetypes[delver.archetype].specializationsUnlocked)) {
			if (specialization !== delver.specialization) {
				const archetypeActionName = getArchetypeActionName(delver.archetype, specialization);
				specializationsDescriptions.push(`${bold(specialization)} - ${archetypeActionName}\n${buildGearDescription(archetypeActionName)}`)
				specializationOptions.push({
					label: specialization,
					value: specialization
				})
			}
		}
		if (specializationOptions.length < 1) {
			interaction.reply({ content: "You haven't unlocked any other specializations for this archetype.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({
			content: `${delver.specialization === "base" ? "You do not currently have a specialization." : `Your current specialization is ${delver.archetype} - ${delver.specialization}.`} You can select a new Specialzation to switch to! Here are your options:\n${specializationsDescriptions.join("\n\n")}`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(SKIP_INTERACTION_HANDLING)
						.setPlaceholder("Select a specialzation...")
						.addOptions(specializationOptions)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000, componentType: ComponentType.StringSelect })).then(collectedInteraction => {
			const adventure = getAdventure(interaction.channelId);
			if (!adventure) {
				return collectedInteraction.update({ components: [] });
			}

			const [_, cost] = interaction.customId.split(SAFE_DELIMITER);
			if (adventure.gold < parseInt(cost)) {
				return collectedInteraction.update({ content: "You can't afford the Specialization Switching Fee.", embeds: [], components: [] });
			}
			adventure.gold -= cost;
			const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const specialization = collectedInteraction.values[0];
			delver.specialization = specialization;

			// Send confirmation text
			interaction.channel.send({ content: `${bold(interaction.user.displayName)} has switched to the ${bold(specialization)} specialization.` });
			interaction.message.edit(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
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
