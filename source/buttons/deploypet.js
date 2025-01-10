const { ActionRowBuilder, StringSelectMenuBuilder, bold, ButtonStyle, ButtonBuilder, MessageFlags } = require('discord.js');
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
			interaction.reply({ content: "You don't currently have any pets to bring on adventure.", flags: [MessageFlags.Ephemeral] });
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
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}clear`)
						.setStyle(ButtonStyle.Danger)
						.setLabel("Deselect Pet")
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(({ resource: { message: reply } }) => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(interaction.channelId);
				if (adventure?.state !== "config") {
					collectedInteraction.reply({ content: "A valid adventure could not be found.", flags: [MessageFlags.Ephemeral] });
					return;
				}

				const [_, mainId] = collectedInteraction.customId.split(SKIP_INTERACTION_HANDLING);
				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				switch (mainId) {
					case "pet":
						const isSwitching = delver.pet.type === "";
						const selectedPet = collectedInteraction.values[0];
						delver.pet = {
							type: selectedPet,
							level: getPlayer(interaction.user.id, interaction.guildId).pets[selectedPet]
						};


						// Send confirmation text
						interaction.channel.send({ content: `${bold(interaction.user.displayName)} ${isSwitching ? "has switched to" : "will be"} bringing their ${bold(selectedPet)} pet.` });
						break;
					case "clear":
						delver.pet = { type: "", level: 0 };
						interaction.channel.send({ content: `${bold(interaction.user.displayName)} has decided not to bring a pet.` });
						break;
				}
				setAdventure(adventure);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		});
	}
);
