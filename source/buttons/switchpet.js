const { ActionRowBuilder, StringSelectMenuBuilder, bold } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "switchpet";
module.exports = new ButtonWrapper(mainId, 3000,
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
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
			interaction.reply({ content: "You don't currently have any pets to bring on adventure.", ephemeral: true });
			return;
		}

		interaction.reply({
			content: `Select a new pet to bring on the adventure! Your current pet (${delver.pet.type}) will be sent home.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(SKIP_INTERACTION_HANDLING)
						.setPlaceholder("Select an pet...")
						.addOptions(petOptions)
				)
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				if (!adventure) {
					collectedInteraction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
					return;
				}

				const [_, cost] = interaction.customId.split(SAFE_DELIMITER);
				if (adventure.gold >= cost) {
					adventure.gold -= cost;
					const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
					const pet = collectedInteraction.values[0];
					delver.pet = { type: pet, level: getPlayer(interaction.user.id, interaction.guildId).pets[pet] };

					// Send confirmation text
					interaction.channel.send({ content: `${bold(interaction.user.displayName)} has switched to bringing their ${bold(pet)} pet.` });
					setAdventure(adventure);
				}
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		});
	}
);
