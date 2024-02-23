const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "tinker";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to tinker with a piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const options = [];
		delver.gear.forEach((gear, index) => {
			const sidegrades = getGearProperty(gear.name, "sidegrades");
			if (sidegrades.length > 0) {
				options.push({
					label: gear.name,
					description: trimForSelectOptionDescription(`Possibilities: ${listifyEN(sidegrades, true)}`),
					value: index.toString()
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any gear that can be tinkered with.", ephemeral: true });
			return;
		}

		interaction.deferReply({ ephemeral: true }).then(() => {
			return interaction.editReply({
				content: "You can use 1 room action to change a piece of gear to a different upgrade.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
							.setPlaceholder("Pick a piece of gear to randomly tinker with...")
							.setOptions(options)
					)
				]
			});
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const [_, startedDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				const adventure = getAdventure(collectedInteraction.channelId);
				if (!adventure.room.hasResource("roomAction") || startedDepth !== adventure.depth.toString()) {
					return;
				}

				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const index = parseInt(collectedInteraction.values[0]);
				const gearName = delver.gear[index].name;
				/** @type {string[]} */
				const sidegrades = getGearProperty(gearName, "sidegrades");
				const sidegradeName = sidegrades[adventure.generateRandomNumber(sidegrades.length, "general")];
				transformGear(delver, index, gearName, sidegradeName);
				adventure.room.history.Tinkerers.push(delver.name);
				adventure.room.decrementResource("roomAction", 1);
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}**'s *${gearName}* has been tinkered to **${sidegradeName}**!`);
				setAdventure(adventure);
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				});
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);
