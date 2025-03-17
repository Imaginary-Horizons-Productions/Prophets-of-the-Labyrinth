const { ButtonWrapper } = require('../classes');
const { RN_TABLE_BASE } = require('../constants');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord, getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor, getEmoji } = require('../util/essenceUtil');

const mainId = "takeswordfromcomet";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Taking sword results in fight 75% of the time */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}
		adventure.room.history["Took sword"].push(interaction.member.displayName);

		const name = "Sword of the Sun"
		if (!adventure.room.hasResource(name)) {
			interaction.reply({ content: `There are no more ${name} to take.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const hasFreeGearSlots = delver.gear.length < adventure.getGearCapacity();
		let charges = getGearProperty(name, "maxCharges");
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.essence))
			.setAuthor(randomAuthorTip())
			.setTitle("Take this gear?")
			.addFields({ name: `${name} ${getEmoji(getGearProperty(name, "essence"))}`, value: buildGearDescription(name) });
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
				adventure.room.decrementResource(name, 1);
				adventure.room.history["Awoke Comet"].push(interaction.member.displayName);
				interaction.message.edit(renderRoom(adventure, interaction.channel, `Comet has awoken! :anger::wolf:`));
				interaction.channel.send(`${interaction.member.displayName} takes the Sword of the Sun, and Comet wakes!`)
				setAdventure(adventure);

				return collectedInteraction;
			}
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
		});
	}
);
