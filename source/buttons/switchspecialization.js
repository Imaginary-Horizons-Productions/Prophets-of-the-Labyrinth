const { ActionRowBuilder, StringSelectMenuBuilder, bold, MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArchetype, getArchetypeActionName } = require('../archetypes/_archetypeDictionary');
const { renderRoom } = require('../util/embedUtil');

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
		const specializationOptions = [];
		for (const specialization of getArchetype(delver.archetype).specializations.slice(0, player.archetypes[delver.archetype].specializationsUnlocked)) {
			if (specialization !== delver.specialization) {
				specializationOptions.push({
					label: specialization,
					description: `Archetype Action: ${getArchetypeActionName(delver.archetype, specialization)}`,
					value: specialization
				})
			}
		}
		if (specializationOptions.length < 1) {
			interaction.reply({ content: "You haven't unlocked any other specializations for this archetype.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({
			content: `${delver.specialization === "base" ? "You do not currently have a specialization." : `Your current specialization is ${delver.archetype} - ${delver.specialization}.`} You can select a new specialzation to switch to!`,
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
		}).then(({ resource: { message: reply } }) => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				if (!adventure) {
					collectedInteraction.reply({ content: "A valid adventure could not be found.", flags: [MessageFlags.Ephemeral] });
					return;
				}

				const [_, cost] = interaction.customId.split(SAFE_DELIMITER);
				if (adventure.gold >= cost) {
					adventure.gold -= cost;
					const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
					const specialization = collectedInteraction.values[0];
					delver.specialization = specialization;

					// Send confirmation text
					interaction.channel.send({ content: `${bold(interaction.user.displayName)} has switched to the ${bold(specialization)} specialization.` });
					interaction.message.edit(renderRoom(adventure, interaction.channel));
					setAdventure(adventure);
				}
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		});
	}
);
