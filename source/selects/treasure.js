const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, bold } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord, getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor } = require('../util/elementUtil');
const { getNumberEmoji } = require('../util/textUtil');

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

		if (adventure.room.actions < 1) {
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
			case "Currency":
				adventure.gainGold(count);
				delete adventure.room.resources[name];
				adventure.room.actions--;
				adventure.room.history["Treasure picked"].push(name);
				setAdventure(adventure);
				interaction.update(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				break;
			case "Artifact":
				adventure.gainArtifact(name, count);
				delete adventure.room.resources[name];
				adventure.room.actions--;
				adventure.room.history["Treasure picked"].push(name);
				setAdventure(adventure);
				interaction.update(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				break;
			case "Item":
				adventure.gainItem(name, count);
				delete adventure.room.resources[name];
				adventure.room.actions--;
				adventure.room.history["Treasure picked"].push(name);
				setAdventure(adventure);
				interaction.update(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				break;
			case "Gear":
				const hasFreeGearSlots = delver.gear.length < adventure.getGearCapacity();
				let charges = getGearProperty(name, "maxCharges");
				const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Spellcraft");
				if (shoddyPenalty) {
					charges = Math.ceil(charges * (100 - shoddyPenalty) / 100);
				}
				const embed = new EmbedBuilder().setColor(getColor(adventure.room.element))
					.setAuthor(randomAuthorTip())
					.setTitle("Pick this gear?")
					.addFields({ name, value: buildGearDescription(name) });
				const components = [];
				if (hasFreeGearSlots) {
					components.push(
						new ActionRowBuilder().addComponents(
							new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}take${SAFE_DELIMITER}${adventure.depth}`)
								.setStyle(ButtonStyle.Success)
								.setEmoji(getNumberEmoji(1))
								.setLabel(`Pick: ${name}`)
						)
					);
				} else {
					embed.addFields({ name: "Replacing Gear", value: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. You'll have to discard gear you're holding to buy this new one.` })
					components.push(new ActionRowBuilder().addComponents(
						delver.gear.map((gear, index) => {
							return new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}replace${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${index}`)
								.setStyle(ButtonStyle.Secondary)
								.setEmoji(getNumberEmoji(1))
								.setLabel(`Replace: ${gear.name}`)
						})
					));
				}
				interaction.reply({
					embeds: [embed],
					components,
					ephemeral: true,
					fetchReply: true
				}).then(reply => {
					const collector = reply.createMessageComponentCollector({ max: 1 });
					collector.on("collect", collectedInteraction => {
						const [mainId, startedDepth, gearIndex] = collectedInteraction.customId.split(SAFE_DELIMITER);
						const adventure = getAdventure(collectedInteraction.channelId);
						if (name in adventure.room.resources) {
							const { count } = adventure.room.resources[name];
							if (count < 1 || startedDepth !== adventure.depth.toString()) {
								return;
							}

							const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
							const gearRecord = buildGearRecord(name, adventure);
							let discardedName;
							if (mainId.endsWith("replace")) {
								discardedName = delver.gear[gearIndex].name;
								delver.gear.splice(gearIndex, 1, gearRecord);
							} else {
								delver.gear.push(gearRecord);
							}
							if (delver.hp > delver.getMaxHP()) {
								delver.hp = delver.getMaxHP();
							}
							collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
								adventure.room.actions--;
								adventure.room.decrementResource(name, 1);
								adventure.room.history["Treasure picked"].push(name);
								return roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
							}).then(() => {
								collectedInteraction.channel.send(`${bold(collectedInteraction.member.displayName)} takes a ${name}${discardedName ? ` (${discardedName} discarded)` : ""}.`);
								setAdventure(adventure);
							})
						}
					})

					collector.on("end", async (interactionCollection) => {
						await interactionCollection.first().update({ components: [] });
						interaction.deleteReply();
					})
				});
				break;
		}
	}
);
