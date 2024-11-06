const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getNumberEmoji } = require('../util/textUtil');

const mainId = "repair";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow the user to select a piece of gear to regain durability on */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const actionCost = 1;
		if (adventure.room.actions < actionCost) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		let description = "The piece of gear you pick will regain half its max durability. Here is the state of your gear:";
		const options = [];
		delver.gear.forEach((gear, index) => {
			const maxDurability = getGearProperty(gear.name, "maxDurability");
			if (maxDurability > 0 && gear.durability < maxDurability) {
				const value = Math.min(Math.ceil(maxDurability / 2), maxDurability - gear.durability);
				description += `\n${underline(gear.name)} Will regain ${value} durability (${gear.durability}/${maxDurability})`
				options.push({
					label: gear.name,
					value: `${gear.name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${value}`
				})
			}
		})

		if (options.length < 1) {
			interaction.reply({ content: "None of your gear needs repair.", ephemeral: true });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(Colors.LightGrey)
					.setAuthor(randomAuthorTip())
					.setTitle("Repairing Gear")
					.setDescription(description)
			],
			components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
					.setPlaceholder(`${getNumberEmoji(actionCost)} Repair a gear piece...`)
					.setOptions(options)
			)],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const [_, startedDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				if (startedDepth !== adventure.depth.toString() || adventure.room.actions < 1) {
					return;
				}

				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const [gearName, index, value] = collectedInteraction.values[0].split(SAFE_DELIMITER);
				delver.gear[Number(index)].durability += Number(value);
				adventure.room.history.Repairers.push(delver.name);
				adventure.room.actions -= actionCost;
				setAdventure(adventure);
				collectedInteraction.channel.send({ content: `**${collectedInteraction.member.displayName}** repaired ${value} durability on their ${gearName}.` });
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				})
			})

			collector.on("end", async (interactionCollection) => {
				await interactionCollection.first().update({ components: [] });
				interaction.deleteReply();
			})
		})
	}
);
