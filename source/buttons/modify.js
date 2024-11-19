const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { trimForSelectOptionDescription, listifyEN, getNumberEmoji } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');

const mainId = "modify";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to modify a piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const actionCost = 1;
		if (adventure.room.actions < actionCost) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const sidegradesPreviews = [];
		const options = [];
		delver.gear.forEach((gear, index) => {
			const sidegrades = getGearProperty(gear.name, "sidegrades");
			if (sidegrades.length > 0) {
				sidegradesPreviews.push({
					name: gear.name,
					value: sidegrades.map(sidegrade => {
						const description = buildGearDescription(sidegrade, false, delver);
						return `- ${underline(sidegrade)} ${description}`;
					}).join("\n")
				});
				options.push({
					label: gear.name,
					value: index.toString()
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any upgraded gear that can be modified with.", ephemeral: true });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(Colors.DarkAqua)
					.setAuthor(randomAuthorTip())
					.setTitle("Modifying Gear")
					.setDescription("The piece of gear you pick will be changed to a different upgrade. Here are the possible modifications:")
					.addFields(sidegradesPreviews)
			],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
						.setPlaceholder(`${getNumberEmoji(actionCost)} Modify a gear piece...`)
						.setOptions(options)
				)
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const [_, startedDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				const adventure = getAdventure(collectedInteraction.channelId);
				if (adventure.room.actions < 1 || startedDepth !== adventure.depth.toString()) {
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
				adventure.room.actions -= actionCost;
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}**'s *${gearName}* has been modified to **${sidegradeName}**!`);
				setAdventure(adventure);
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				});
			})

			collector.on("end", async (interactionCollection) => {
				await interactionCollection.first().update({ components: [] });
				interaction.deleteReply();
			})
		})
	}
);
