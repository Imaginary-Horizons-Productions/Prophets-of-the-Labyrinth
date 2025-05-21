const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline, MessageFlags, ComponentType, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { getNumberEmoji } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getEmoji } = require('../util/essenceUtil');
const { EmbedLimits } = require('@sapphire/discord.js-utilities');

const mainId = "upgrade";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to upgrade a piece of gear */
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

		const upgradesPreviews = [];
		const options = [];
		delver.gear.forEach((gear, index) => {
			const upgrades = getGearProperty(gear.name, "upgrades");
			if (upgrades.length > 0) {
				const upgradeTexts = upgrades.map(upgrade => {
					const description = buildGearDescription(upgrade, false);
					return `${underline(upgrade)} ${getEmoji(getGearProperty(upgrade, "essence"))}\n${description}`;
				});
				let validatedText = "";
				let andMoreText = "...and more!";
				for (let i = 0; i < upgradeTexts.length; i++) {
					const nextText = upgradeTexts[i];
					if (validatedText.length + nextText.length > EmbedLimits.MaximumFieldValueLength - andMoreText.length) {
						validatedText += andMoreText;
						break;
					} else {
						validatedText += `${nextText}\n\n`;
					}
				}
				upgradesPreviews.push({
					name: gear.name,
					value: validatedText
				});
				options.push({
					label: gear.name,
					value: index.toString()
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any gear that can be upgraded.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(Colors.Orange)
					.setAuthor(randomAuthorTip())
					.setTitle("Upgrading Gear")
					.setDescription("The piece of gear you pick will be upgraded, but the upgrade it receives will be random. Here are the possible upgrades for your gear:")
					.addFields(upgradesPreviews)
			],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${adventure.depth}`)
						.setPlaceholder(`${getNumberEmoji(actionCost)} Upgrade a gear piece...`)
						.setOptions(options)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000, componentType: ComponentType.StringSelect })).then(collectedInteraction => {
			const adventure = getAdventure(collectedInteraction.channelId);
			const [_, startingDepth] = collectedInteraction.customId.split(SKIP_INTERACTION_HANDLING);
			if (adventure.room.actions < 1 || startingDepth !== adventure.depth.toString()) {
				return collectedInteraction;
			}

			const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const index = parseInt(collectedInteraction.values[0]);
			const gearName = delver.gear[index].name;
			/** @type {string[]} */
			const upgradePool = getGearProperty(gearName, "upgrades");
			const upgradeName = upgradePool[adventure.generateRandomNumber(upgradePool.length, "general")];
			transformGear(delver, index, gearName, upgradeName);
			adventure.room.history.Upgraders.push(delver.name);
			adventure.room.actions -= actionCost;
			setAdventure(adventure);
			interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
			collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}**'s *${gearName}* has been upgraded to **${upgradeName}**!`);
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
