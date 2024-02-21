const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { renderRoom } = require('../util/embedUtil');

const mainId = "blackbox";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow delver trade a gear piece for the black box gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.history["Traded for box"].length > 0) {
			interaction.reply({ content: "The black box has already been opened.", ephemeral: true });
			return;
		}

		if (delver.gear.length < 1) {
			interaction.reply({ content: "You don't have any gear to trade.", ephemeral: true });
			return;
		}

		interaction.deferReply({ ephemeral: true }).then(() => {
			return interaction.editReply({
				content: "You can trade a piece of gear the mysterious Rare gear in the black box.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
							.setPlaceholder("Pick a piece of gear to trade...")
							.setOptions(delver.gear.map((gear, index) => ({
								label: gear.name,
								value: index.toString()
							})))
					)
				]
			});
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", (collectedInteraction) => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				if (!delver) {
					return;
				}

				if (adventure.room.history["Traded for box"].length > 0) {
					collectedInteraction.reply({ content: "The black box has already been opened.", ephemeral: true });
					return;
				}

				const gearIndex = collectedInteraction.values[0];
				const blackBoxResource = Object.values(adventure.room.resources).find(resource => resource.type === "gear");
				delete adventure.room.resources[blackBoxResource.name];
				const tradedGearName = delver.gear[gearIndex].name;
				adventure.room.history["Traded for box"].push(tradedGearName);
				delver.gear.splice(gearIndex, 1, buildGearRecord(blackBoxResource.name, "max"));
				interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					roomMessage.edit(renderRoom(adventure, interaction.channel));
				})
				setAdventure(adventure);
				interaction.channel.send(`**${interaction.user.displayName}** trades their **${tradedGearName}** for the **${blackBoxResource.name}** in the black box.`);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);
