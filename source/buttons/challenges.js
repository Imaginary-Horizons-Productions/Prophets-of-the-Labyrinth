const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper, Challenge } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getChallenge } = require('../challenges/_challengeDictionary');
const { trimForSelectOptionDescription } = require('../util/textUtil');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "challenges";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Roll challenge options for party to select */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
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
			new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
				.setPlaceholder("Select a challenge...")
				.addOptions(options)
		)];
		interaction.reply({ content: "Shoot for glory (and higher scores)! Add a challenge to the run:", components, ephemeral: true, fetchReply: true }).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const [_, startingDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				const challengeName = collectedInteraction.values[0];
				if (startingDepth !== adventure?.depth.toString() || !adventure?.room.hasResource("roomAction")) {
					return;
				}

				const { intensity, duration, reward } = getChallenge(challengeName);
				if (adventure.challenges[challengeName]) {
					adventure.challenges[challengeName].intensity += intensity;
					adventure.challenges[challengeName].duration += duration;
					adventure.challenges[challengeName].reward += reward;
				} else {
					adventure.challenges[challengeName] = new Challenge(intensity, reward, duration);
				}
				adventure.room.decrementResource("roomAction", 1);
				adventure.room.history["New challenges"].push(challengeName);
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				})
				collectedInteraction.channel.send({ content: `The party takes on a new challenge: ${challengeName}` });
				setAdventure(adventure);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);
