const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { EMPTY_SELECT_OPTION_SET, SKIP_INTERACTION_HANDLING } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "sellgear";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Create select with sellable gear options */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const pricePercent = 50;
		const saleOptions = delver.gear.map((gear, index) => {
			const maxCharges = getGearProperty(gear.name, "maxCharges");
			if (maxCharges > 0) {
				return {
					label: `${gear.name} (${gear.charges}/${maxCharges})`,
					description: `${Math.floor(getGearProperty(gear.name, "cost") * pricePercent / 100 * gear.charges / maxCharges)}g`,
					value: index.toString()
				};
			} else {
				return {
					label: gear.name,
					description: `${Math.floor(getGearProperty(gear.name, "cost") * pricePercent / 100)}g`,
					value: index.toString()
				};
			}
		});
		if (saleOptions.length > 0) {
			interaction.reply({
				content: "The Merchant marks down their price for missing Charges on Spells.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${adventure.depth}`)
							.setPlaceholder("Select a piece of gear to sell...")
							.setOptions(saleOptions)
					)
				],
				flags: [MessageFlags.Ephemeral],
				withResponse: true
			}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
				const [_, startedDepth] = collectedInteraction.customId.split(SKIP_INTERACTION_HANDLING);
				const adventure = getAdventure(collectedInteraction.channelId);
				if (adventure?.depth.toString() !== startedDepth) {
					return collectedInteraction;
				}

				const [saleIndex] = collectedInteraction.values;
				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const gearName = delver.gear[saleIndex].name;
				let price = pricePercent / 100 * getGearProperty(gearName, "cost");
				const maxCharges = getGearProperty(gearName, "maxCharges");
				if (maxCharges > 0) {
					price *= (delver.gear[saleIndex].charges / maxCharges);
				}
				price = Math.floor(price);
				delver.gear.splice(saleIndex, 1);
				adventure.gainGold(price);
				setAdventure(adventure);
				interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** sells their ${gearName} for ${price}g.`);
				return collectedInteraction;
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
			})
		} else {
			interaction.reply({
				content: "The Merchant marks down their price for missing Charges on Spells.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
							.setPlaceholder("No gear to sell...")
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					)
				],
				flags: [MessageFlags.Ephemeral]
			})
		}
	}
);
