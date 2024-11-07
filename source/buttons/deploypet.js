const { ActionRowBuilder, StringSelectMenuBuilder, bold } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');

const mainId = "deploypet";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select to pick a pet */
	(interaction, args) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const petOptions = [];
		for (const petName in player.pets) {
			petOptions.push({
				label: petName,
				description: `Level ${player.pets[petName]}`,
				value: petName
			})
		}
		if (petOptions.length < 1) {
			interaction.reply({ content: "You don't currently have any pets to bring on adventure.", ephemeral: true });
			return;
		}

		interaction.reply({
			content: `Select your pet for this adventure!\n\nPets take turns using their supportive moves to aid party.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(`${SKIP_INTERACTION_HANDLING}pet`)
						.setPlaceholder("Select an pet...")
						.addOptions(petOptions)
				),
				//TODONOW clear pet button
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				if (adventure?.state !== "config") {
					collectedInteraction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
					return;
				}

				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const isSwitching = Boolean(delver.pet);
				const pet = collectedInteraction.values[0];
				delver.pet = pet;
				setAdventure(adventure);

				// Send confirmation text
				interaction.channel.send(`${bold(interaction.user.displayName)} ${isSwitching ? "has switched to" : "will be"} bringing their ${bold(pet)} pet.`);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		});
	}
);
