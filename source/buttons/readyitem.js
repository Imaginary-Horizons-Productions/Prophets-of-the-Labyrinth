const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING, POTL_ICON_URL } = require('../constants');
const { getAdventure, setAdventure, checkNextRound, endRound } = require('../orcustrators/adventureOrcustrator');
const { getColor } = require('../util/essenceUtil');
const { getItem } = require('../items/_itemDictionary');
const { trimForSelectOptionDescription } = require('../util/textUtil');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { injectApplicationEmojiName } = require('../util/graphicsUtil');
const { SelectMenuLimits } = require('@sapphire/discord.js-utilities');

const mainId = "readyitem";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}
		const delverArchetypeTemplate = getArchetype(delver.archetype);
		interaction.reply({
			embeds: [
				delverArchetypeTemplate.predict(new EmbedBuilder().setColor(getColor(adventure.room.essence)).setTitle("Select an Item").setAuthor({ name: "Using an item takes your turn and has priority (it'll happen before non-priority actions)", iconURL: POTL_ICON_URL }), adventure)
			],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${adventure.room.round}`)
						.setPlaceholder("Pick an item...")
						.addOptions(Object.keys(adventure.items).slice(0, SelectMenuLimits.MaximumOptionsLength).reduce((options, item) => options.concat({
							label: `${item} (Held: ${adventure.items[item]})`,
							description: trimForSelectOptionDescription(injectApplicationEmojiName(getItem(item).description)),
							value: item
						}), [])))
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
			const adventure = getAdventure(collectedInteraction.channelId);
			const [_, startingDepth, round] = collectedInteraction.customId.split(SAFE_DELIMITER);
			if (adventure?.room.round !== Number(round) || startingDepth !== adventure.depth.toString()) {
				return collectedInteraction.update({ components: [] });
			}

			const [itemName] = collectedInteraction.values;
			const delver = adventure.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const userIndex = adventure.getCombatantIndex(delver);
			// Filter out: item uses by self and enemy (only count own team)
			const committedCount = adventure.room.moves.filter(move => move.name === itemName && move.userReference.team === delver.team && move.userReference.index !== userIndex).length;
			if (!(itemName in adventure.items && adventure.items[itemName] > committedCount)) {
				return collectedInteraction.update({ content: `The party doesn't have any more ${itemName}(s) to use.`, embeds: [], components: [] });
			}

			// Add move to round list (overwrite exisiting readied move)
			const newMove = new Move(itemName, "item", new CombatantReference(delver.team, userIndex))
				.setSpeedByCombatant(delver)
				.setPriority(1);

			const item = getItem(itemName);
			item.selectTargets(delver, adventure).forEach(target => {
				newMove.addTarget(target);
			})
			let overwritten = false;
			for (let i = 0; i < adventure.room.moves.length; i++) {
				const { userReference, type } = adventure.room.moves[i];
				if (userReference.team === delver.team && userReference.index === userIndex && type !== "pet") {
					adventure.room.moves.splice(i, 1);
					overwritten = true;
					break;
				}
			}
			adventure.room.moves.push(newMove);

			// Send confirmation text
			collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** ${overwritten ? "switches to ready" : "readies"} a(n) **${itemName}**.`).then(() => {
				setAdventure(adventure);
				if (checkNextRound(adventure)) {
					endRound(adventure, collectedInteraction.channel);
				}
			})
			return collectedInteraction.update({ components: [] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error)
			}
		}).finally(() => {
			if (interaction.channel) { // prevent crash if channel is deleted before cleanup
				interaction.deleteReply();
			}
		});
	}
);
