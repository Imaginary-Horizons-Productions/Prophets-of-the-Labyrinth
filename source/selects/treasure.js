const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, bold, MessageFlags } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord, getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor, getEmoji } = require('../util/essenceUtil');
const { getNumberEmoji } = require('../util/textUtil');
const { butIgnoreInteractionCollectorErrors } = require('../util/dAPIREsponses');

const mainId = "treasure";
module.exports = new SelectWrapper(mainId, 2000,
	/** Treasure room picks decrement a room action */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.room.actions < 1) {
			interaction.reply({ content: "There aren't any more treasure picks to use.", flags: [MessageFlags.Ephemeral] });
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
				interaction.update(renderRoom(adventure, interaction.channel));
				break;
			case "Artifact":
				adventure.gainArtifact(name, count);
				delete adventure.room.resources[name];
				adventure.room.actions--;
				adventure.room.history["Treasure picked"].push(name);
				setAdventure(adventure);
				interaction.update(renderRoom(adventure, interaction.channel));
				break;
			case "Item":
				adventure.gainItem(name, count);
				delete adventure.room.resources[name];
				adventure.room.actions--;
				adventure.room.history["Treasure picked"].push(name);
				setAdventure(adventure);
				interaction.update(renderRoom(adventure, interaction.channel));
				break;
			case "Gear":
				const hasFreeGearSlots = delver.gear.length < adventure.getGearCapacity();
				let charges = getGearProperty(name, "maxCharges");
				const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Spellcraft");
				const shoddyDuration = adventure.getChallengeDuration("Shoddy Spellcraft");
				if (shoddyPenalty > 0 && shoddyDuration > 0) {
					charges = Math.ceil(charges * (100 - shoddyPenalty) / 100);
				}
				const embed = new EmbedBuilder().setColor(getColor(adventure.room.essence))
					.setAuthor(randomAuthorTip())
					.setTitle("Pick this gear?")
					.addFields({ name: `${name} ${getEmoji(getGearProperty(name, "essence"))}`, value: buildGearDescription(name) });
				const components = [];
				if (hasFreeGearSlots) {
					components.push(
						new ActionRowBuilder().addComponents(
							new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}take${SAFE_DELIMITER}${adventure.depth}`)
								.setStyle(ButtonStyle.Success)
								.setEmoji(getNumberEmoji(1))
								.setLabel(`Pick a ${name}`)
						)
					);
				} else {
					embed.addFields({ name: "Replacing Gear", value: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. You'll have to discard gear you're holding to buy this new one.` })
					components.push(new ActionRowBuilder().addComponents(
						delver.gear.map((gear, index) => {
							return new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}replace${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${index}`)
								.setStyle(ButtonStyle.Danger)
								.setEmoji(getNumberEmoji(1))
								.setLabel(`Replace ${gear.name}`)
						})
					));
				}
				interaction.reply({
					embeds: [embed],
					components,
					flags: [MessageFlags.Ephemeral],
					withResponse: true
				}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
					const [mainId, startedDepth, gearIndex] = collectedInteraction.customId.split(SAFE_DELIMITER);
					const adventure = getAdventure(collectedInteraction.channelId);
					if (name in adventure.room.resources) {
						const { count } = adventure.room.resources[name];
						if (count < 1 || startedDepth !== adventure.depth.toString()) {
							return collectedInteraction;
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
						adventure.room.actions--;
						adventure.room.decrementResource(name, 1);
						adventure.room.history["Treasure picked"].push(name);
						interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
						collectedInteraction.channel.send(`${bold(collectedInteraction.member.displayName)} takes a ${name}${discardedName ? ` (${discardedName} discarded)` : ""}.`);
						setAdventure(adventure);
						return collectedInteraction;
					}
				}).then(interactionToAcknowledge => {
					return interactionToAcknowledge.update({ components: [] });
				}).catch(butIgnoreInteractionCollectorErrors).finally(() => {
					if (interaction.channel) { // prevent crash if channel is deleted before cleanup
						interaction.deleteReply();
					}
				});
				break;
		}
	}
);
