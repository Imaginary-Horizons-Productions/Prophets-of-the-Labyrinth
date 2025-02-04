const { ActionRowBuilder, StringSelectMenuBuilder, bold, MessageFlags, ComponentType, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "switchpet";
module.exports = new ButtonWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const petOptions = [];
		for (const petName in player.pets) {
			if (petName !== delver.pet.type) {
				petOptions.push({
					label: petName,
					description: `Level ${player.pets[petName]}`,
					value: petName
				})
			}
		}
		if (petOptions.length < 1) {
			interaction.reply({ content: "You don't currently have any pets to bring on adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({
			content: `Select a new pet to bring on the adventure! Your current pet (${delver.pet.type}) will be sent home.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(SKIP_INTERACTION_HANDLING)
						.setPlaceholder("Select a pet...")
						.addOptions(petOptions)
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
				return collectedInteraction.update({ content: "You can't afford the Pet Switching Fee.", embeds: [], components: [] });
			}
			adventure.gold -= cost;
			const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const pet = collectedInteraction.values[0];
			delver.pet = { type: pet, level: getPlayer(interaction.user.id, interaction.guildId).pets[pet] };

			// Send confirmation text
			interaction.channel.send({ content: `${bold(interaction.user.displayName)} has switched to bringing their ${bold(pet)} pet.` });
			interaction.message.edit(renderRoom(adventure, interaction.channel));
			setAdventure(adventure);
			return collectedInteraction.update({ components: [] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error);
			}
		}).finally(() => {
			if (interaction.channel) { // prevent crash if channel is deleted before cleanup
				interaction.deleteReply();
			}
		});
	}
);
