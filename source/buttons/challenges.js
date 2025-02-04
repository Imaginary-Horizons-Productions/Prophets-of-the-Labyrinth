const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, DiscordjsErrorCodes, ComponentType } = require('discord.js');
const { ButtonWrapper, Challenge } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getChallenge } = require('../challenges/_challengeDictionary');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "challenges";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Roll challenge options for party to select */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const options = [];
		Object.values(adventure.room.resources).forEach(resource => {
			if (resource.type === "challenge") {
				const challengeName = resource.name;
				const challenge = getChallenge(challengeName);
				options.push({ label: challengeName, description: trimForSelectOptionDescription(challenge.dynamicDescription(challenge.intensity, challenge.duration, challenge.reward)), value: challengeName });
			}
		})
		const components = [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${adventure.depth}`)
				.setPlaceholder("Select a challenge...")
				.addOptions(options)
		)];
		interaction.reply({
			content: "Shoot for glory (and higher scores)! Add a challenge to the run:",
			components,
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000, componentType: ComponentType.StringSelect })).then(collectedInteraction => {
			const adventure = getAdventure(collectedInteraction.channelId);
			const [_, startingDepth] = collectedInteraction.customId.split(SKIP_INTERACTION_HANDLING);
			if (adventure?.room.history["New challenges"].length > 0 || startingDepth !== adventure.depth.toString()) {
				return collectedInteraction;
			}

			const [challengeName] = collectedInteraction.values;
			const { intensity, duration, reward } = getChallenge(challengeName);
			if (challengeName in adventure.challenges) {
				adventure.challenges[challengeName].intensity += intensity;
				adventure.challenges[challengeName].duration += duration;
				adventure.challenges[challengeName].reward += reward;
			} else {
				adventure.challenges[challengeName] = new Challenge(intensity, reward, duration);
			}
			adventure.room.history["New challenges"].push(challengeName);
			interaction.message.edit(renderRoom(adventure, collectedInteraction.channel));
			const dropMap = {};
			if (challengeName === "Can't Hold All this Value") {
				const reducedGearCapacity = adventure.getGearCapacity();
				adventure.delvers.forEach(delver => {
					if (delver.gear.length > reducedGearCapacity) {
						dropMap[delver.name] = delver.gear.splice(reducedGearCapacity).map(gear => gear.name);
					}
				})
			}
			collectedInteraction.channel.send({ content: `The party takes on a new challenge: ${challengeName}${Object.entries(dropMap).map(([delverName, gearDropped]) => `\n- ${delverName} drops their ${listifyEN(gearDropped)}`).join("")}` });
			setAdventure(adventure);
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
	}
);
