const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, Colors, underline, bold } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');

const mainId = "recharge";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow the user to select a Spell to recharge */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const [_, cost] = interaction.customId.split(SAFE_DELIMITER);
		const parsedCost = parseInt(cost);
		let description = "The Spell you pick will regain all its charges. Here are your Spells:";
		const options = [];
		delver.gear.forEach((gear, index) => {
			const maxCharges = getGearProperty(gear.name, "maxCharges");
			if (maxCharges > 0 && gear.charges < maxCharges) {
				const value = Math.min(Math.ceil(maxCharges / 2), maxCharges - gear.charges);
				description += `\n${underline(gear.name)} will regain ${value} charges (${gear.charges}/${maxCharges})`
				options.push({
					label: gear.name,
					value: `${gear.name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${value}`
				})
			}
		})

		if (options.length < 1) {
			interaction.reply({ content: "None of your Spells need recharge.", ephemeral: true });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(Colors.LightGrey)
					.setAuthor(randomAuthorTip())
					.setTitle("Recharging Spells")
					.setDescription(description)
			],
			components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
					.setPlaceholder(`${cost}g: Recharge a Spell...`)
					.setOptions(options)
			)],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const [_, startedDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				if (startedDepth !== adventure.depth.toString() || adventure.gold < parsedCost) {
					return;
				}

				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const [gearName, index, value] = collectedInteraction.values[0].split(SAFE_DELIMITER);
				delver.gear[Number(index)].charges += Number(value);
				adventure.room.history.Rechargers.push(delver.name);
				adventure.gold -= parsedCost;
				setAdventure(adventure);
				collectedInteraction.channel.send({ content: `${bold(collectedInteraction.member.displayName)} recharged ${value} charges on their ${gearName}.` });
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
