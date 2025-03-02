const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { getNumberEmoji } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getEmoji } = require('../util/essenceUtil');

const mainId = "modify";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to modify a piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const actionCost = 1;
		if (adventure.room.actions < actionCost) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", flags: [MessageFlags.Ephemeral] });
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
						return `${underline(sidegrade)} ${getEmoji(getGearProperty(sidegrade, "essence"))}\n${description}`;
					}).join("\n\n")
				});
				options.push({
					label: gear.name,
					value: index.toString()
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any upgraded gear that can be modified.", flags: [MessageFlags.Ephemeral] });
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
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${adventure.depth}`)
						.setPlaceholder(`${getNumberEmoji(actionCost)} Modify a gear piece...`)
						.setOptions(options)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
			const [_, startedDepth] = collectedInteraction.customId.split(SKIP_INTERACTION_HANDLING);
			const adventure = getAdventure(collectedInteraction.channelId);
			if (adventure.room.actions < 1 || startedDepth !== adventure.depth.toString()) {
				return collectedInteraction;
			}

			const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const index = parseInt(collectedInteraction.values[0]);
			const gearName = delver.gear[index].name;
			/** @type {string[]} */
			const sidegrades = getGearProperty(gearName, "sidegrades");
			const sidegradeName = sidegrades[adventure.generateRandomNumber(sidegrades.length, "general")];
			transformGear(delver, index, gearName, sidegradeName);
			adventure.room.history.Modders.push(delver.name);
			adventure.room.actions -= actionCost;
			collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}**'s *${gearName}* has been modified to **${sidegradeName}**!`);
			setAdventure(adventure);
			interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
			return collectedInteraction;
		}).then(interactionToAcknowledge => {
			return interactionToAcknowledge.update({ components: [] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error);
			}
		}).finally(() => {
			if (interaction.channel) { // prevent crash if channel is deleted before cleanup
				interaction.deleteReply();
			}
		})
	}
);
