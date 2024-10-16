const { ActionRowBuilder, ButtonBuilder, ButtonStyle, bold } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { renderRoom } = require('../util/embedUtil');

const mainId = "buygear";
module.exports = new SelectWrapper(mainId, 3000,
	/** Create the gear details embed so player can decide whether to make the purchase */
	(interaction, [tier]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		if (!adventure.room.hasResource(name)) {
			interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
			return;
		}

		const { cost } = adventure.room.resources[name];
		if (adventure.gold < cost) {
			interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
			return;
		}

		if (delver.gear.length < adventure.getGearCapacity()) {
			adventure.gold -= cost;
			adventure.room.decrementResource(name, 1);
			delver.gear.push(buildGearRecord(name, adventure));
			interaction.message.edit(renderRoom(adventure, interaction.channel));
			interaction.reply({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
			setAdventure(adventure);
		} else {
			interaction.reply({
				content: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. Pick one to replace:`,
				components: [new ActionRowBuilder().addComponents(
					delver.gear.map((gear, index) => {
						return new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${index}`)
							.setLabel(`Discard ${gear.name}`)
							.setStyle(ButtonStyle.Secondary)
					})
				)],
				ephemeral: true,
				fetchReply: true
			}).then(reply => {
				const collector = reply.createMessageComponentCollector({ max: 1 });
				collector.on("collect", collectedInteraction => {
					const [_, startedDepth, gearIndex] = collectedInteraction.customId.split(SAFE_DELIMITER);
					const adventure = getAdventure(collectedInteraction.channelId);
					const { count, cost } = adventure.room.resources[name];
					if (count < 1 || startedDepth !== adventure.depth.toString()) {
						return;
					}

					const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
					const discardedName = delver.gear[gearIndex].name;
					delver.gear.splice(gearIndex, 1, buildGearRecord(name, adventure));
					collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
						adventure.room.decrementResource(name, 1);
						adventure.gold -= cost;
						return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
					}).then(() => {
						collectedInteraction.channel.send(`${bold(collectedInteraction.member.displayName)} buys a ${name} for ${cost}g (${discardedName} discarded).`);
						setAdventure(adventure);
					})
				})

				collector.on("end", async (interactionCollection) => {
					await interactionCollection.first().update({ components: [] });
					interaction.deleteReply();
				})
			})
		}
	}
);
