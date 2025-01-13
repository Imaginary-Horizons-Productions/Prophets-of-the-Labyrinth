const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord, getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor } = require('../util/essenceUtil');

const mainId = "loot";
module.exports = new SelectWrapper(mainId, 2000,
	/** End of combat loot */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
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
				setAdventure(adventure);
				interaction.reply({ content: `The party acquires ${count} gold.` }).then(() => {
					interaction.message.edit(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				});
				break;
			case "Artifact":
				adventure.gainArtifact(name, count);
				delete adventure.room.resources[name];
				setAdventure(adventure);
				interaction.reply({ content: `The party acquires ${count} ${name}.` }).then(() => {
					interaction.message.edit(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				});
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
					.setTitle("Take this gear?")
					.addFields({ name, value: buildGearDescription(name) });
				const components = [];
				if (hasFreeGearSlots) {
					components.push(
						new ActionRowBuilder().addComponents(
							new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}take${SAFE_DELIMITER}${adventure.depth}`)
								.setStyle(ButtonStyle.Success)
								.setLabel(`Take a ${name}`)
						)
					);
				} else {
					embed.addFields({ name: "Replacing Gear", value: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. You'll have to discard gear you're holding to buy this new one.` })
					components.push(new ActionRowBuilder().addComponents(
						delver.gear.map((gear, index) => {
							return new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}replace${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${index}`)
								.setStyle(ButtonStyle.Danger)
								.setLabel(`Replace ${gear.name}`)
						})
					));
				}
				interaction.reply({
					embeds: [embed],
					components,
					flags: [MessageFlags.Ephemeral],
					withResponse: true
				}).then(({ resource: { message: reply } }) => {
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
							adventure.room.decrementResource(name, 1);
							interaction.message.edit(renderRoom(adventure, collectedInteraction.channel)).then(() => {
								collectedInteraction.channel.send({ content: `${interaction.member.displayName} takes a ${name}${discardedName ? ` (${discardedName} discarded)` : ""}. There are ${count - 1} remaining.` });
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
			case "Item":
				adventure.gainItem(name, count);
				delete adventure.room.resources[name];
				setAdventure(adventure);
				interaction.reply({ content: `The party acquires ${count} ${name}.` }).then(() => {
					interaction.message.edit(renderRoom(adventure, interaction.channel, interaction.message.embeds[0].description));
				});
				break;
			default:
				interaction.update({ content: ZERO_WIDTH_WHITESPACE });
				return;
		}
	}
);
