const { ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, EmbedBuilder, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { buildGearRecord, getGearProperty, buildGearDescription } = require('../gear/_gearDictionary');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor, getEmoji } = require('../util/essenceUtil');

const mainId = "buygear";
module.exports = new SelectWrapper(mainId, 3000,
	/** Create the gear details embed so player can decide whether to make the purchase */
	(interaction, [tier]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		if (!adventure.room.hasResource(name)) {
			interaction.reply({ content: `There are no more ${name} for sale.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const { cost } = adventure.room.resources[name];
		if (adventure.gold < cost) {
			interaction.reply({ content: "You don't have enough money to buy that.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const hasFreeGearSlots = delver.gear.length < adventure.getGearCapacity();
		let charges = getGearProperty(name, "maxCharges");
		const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Spellcraft");
		const shoddyDuration = adventure.getChallengeDuration("Shoddy Spellcraft");
		if (shoddyPenalty > 0 && shoddyDuration > 0) {
			charges = Math.ceil(charges * (100 - shoddyPenalty) / 100);
		}
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.essence))
			.setAuthor(randomAuthorTip())
			.setTitle("Buy this gear?")
			.addFields({ name: `${name} ${getEmoji(getGearProperty(name, "essence"))}`, value: buildGearDescription(name) });
		const components = [];
		if (hasFreeGearSlots) {
			components.push(
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}buy${SAFE_DELIMITER}${adventure.depth}`)
						.setStyle(ButtonStyle.Success)
						.setLabel(`Buy for ${cost}g`)
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
				const { count, cost } = adventure.room.resources[name];
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
				adventure.gold -= cost;
				interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
				collectedInteraction.channel.send(`${bold(collectedInteraction.member.displayName)} buys a ${name} for ${cost}g${discardedName ? ` (${discardedName} discarded)` : ""}.`);
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
