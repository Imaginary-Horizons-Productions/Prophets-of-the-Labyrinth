const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getNumberEmoji } = require('../util/textUtil');
const { transformGear } = require('../util/delverUtil');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');

const mainId = "upgrade";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to upgrade a piece of gear */
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

		const upgradesPreviews = [];
		const options = [];
		delver.gear.forEach((gear, index) => {
			const upgrades = getGearProperty(gear.name, "upgrades");
			if (upgrades.length > 0) {
				upgradesPreviews.push({
					name: gear.name,
					value: upgrades.map(upgrade => {
						const description = buildGearDescription(upgrade, false, delver);
						return `- ${underline(upgrade)} ${description}`;
					}).join("\n")
				});
				options.push({
					label: gear.name,
					value: index.toString()
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any gear that can be upgraded.", ephemeral: true });
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
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
						.setPlaceholder(`${getNumberEmoji(actionCost)} Upgrade a gear piece...`)
						.setOptions(options)
				)
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const [_, startingDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				if (adventure.room.actions < 1 || startingDepth !== adventure.depth.toString()) {
					return;
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
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				})
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}**'s *${gearName}* has been upgraded to **${upgradeName}**!`);
			})

			collector.on("end", async (interactionCollection) => {
				await interactionCollection.first().update({ components: [] });
				interaction.deleteReply();
			})
		})
	}
);
