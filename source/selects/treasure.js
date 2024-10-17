const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "treasure";
module.exports = new SelectWrapper(mainId, 2000,
	/** Treasure room picks decrement a room action */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (!adventure.room.hasResource("roomAction", 1)) {
			interaction.reply({ content: "There aren't any more treasure picks to use.", ephemeral: true });
			return;
		}

		const [name, index] = interaction.values[0].split(SAFE_DELIMITER);
		if (!adventure.room.hasResource(name)) { // Prevents double message if multiple players take near same time
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
			return;
		}

		const { type, count } = adventure.room.resources[name];
		switch (type) {
			case "gold":
				adventure.gainGold(count);
				delete adventure.room.resources[name];
				break;
			case "artifact":
				adventure.gainArtifact(name, count);
				delete adventure.room.resources[name];
				break;
			case "gear":
				if (delver.gear.length >= adventure.getGearCapacity()) {
					interaction.reply({
						content: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. Pick one to replace with the ${name}:`,
						components: [new ActionRowBuilder().addComponents(delver.gear.map((gear, index) => {
							return new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${index}`)
								.setLabel(`Discard ${gear.name}`)
								.setStyle(ButtonStyle.Secondary)
						}))],
						ephemeral: true,
						fetchReply: true
					}).then(reply => {
						const collector = reply.createMessageComponentCollector({ max: 1 });
						collector.on("collect", collectedInteraction => {
							const [_, startedDepth, gearIndex] = collectedInteraction.customId.split(SAFE_DELIMITER);
							const adventure = getAdventure(collectedInteraction.channelId);
							if (adventure.room.resources[name].count < 1 || startedDepth !== adventure.depth.toString()) {
								return;
							}

							const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
							const discardedName = delver.gear[gearIndex].name;
							delver.gear.splice(gearIndex, 1, buildGearRecord(name, adventure));
							collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
								adventure.room.decrementResource("roomAction", 1);
								adventure.room.decrementResource(name, 1);
								adventure.room.history["Treasure picked"].push(name);
								return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
							}).then(() => {
								collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** takes a ${name} (${discardedName} discarded).`);
								setAdventure(adventure);
							})
						})

						collector.on("end", async (interactionCollection) => {
							await interactionCollection.first().update({ components: [] });
							interaction.deleteReply();
						})
					})
					return;
				} else {
					delver.gear.push(buildGearRecord(name, adventure));
					if (adventure.room.resources[name].count > 1) {
						adventure.room.resources[name].count--;
					} else {
						delete adventure.room.resources[name];
					}
					interaction.channel.send({ content: `${interaction.member.displayName} takes a ${name}. There are ${count - 1} remaining.` });
				}
				break;
			case "item":
				adventure.gainItem(name, count);
				delete adventure.room.resources[name];
				break;
		}
		adventure.room.decrementResource("roomAction", 1);
		adventure.room.history["Treasure picked"].push(name);
		setAdventure(adventure);
		interaction.update(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
	}
);
