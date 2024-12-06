const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, bold } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getNumberEmoji } = require('../util/textUtil');

const mainId = "blackbox";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow delver trade a gear piece for the black box artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.history["Traded for box"].length > 0) {
			interaction.reply({ content: "The black box has already been opened.", ephemeral: true });
			return;
		}

		if (delver.gear.length < 1) {
			interaction.reply({ content: "You don't have any gear to trade.", ephemeral: true });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setAuthor(randomAuthorTip())
					.setTitle("Opening the Black Box")
					.setDescription("The black box has a gear-shaped keyhole on the front and shaking the box makes the sound of an artifact tumbling about inside. You could trade a piece of gear for the artifact inside, but there's no way to know what you'll get...")
			],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}`)
						.setPlaceholder(`${getNumberEmoji(0)} Trade a gear piece...`)
						.setOptions(delver.gear.map((gear, index) => ({
							label: gear.name,
							value: index.toString()
						})))
				)
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", (collectedInteraction) => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const [_, startingDepth] = collectedInteraction.customId.split(SAFE_DELIMITER);
				if (adventure?.depth !== parseInt(startingDepth)) {
					return;
				}

				if (adventure.room.history["Traded for box"].length > 0) {
					collectedInteraction.reply({ content: "The black box has already been opened.", ephemeral: true });
					return;
				}

				const gearIndex = collectedInteraction.values[0];
				const artifactResource = Object.values(adventure.room.resources).find(resource => resource.type === "Artifact");
				delete adventure.room.resources[artifactResource.name];
				const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const tradedGearName = delver.gear[gearIndex].name;
				adventure.room.history["Traded for box"].push(tradedGearName);
				delver.gear.splice(gearIndex, 1);
				adventure.gainArtifact(artifactResource.name, artifactResource.count);
				collectedInteraction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
					roomMessage.edit(renderRoom(adventure, collectedInteraction.channel));
				})
				setAdventure(adventure);
				collectedInteraction.channel.send(`${bold(delver.name)} trades their ${bold(tradedGearName)} for the ${bold(artifactResource.name)} in the black box.`);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);
