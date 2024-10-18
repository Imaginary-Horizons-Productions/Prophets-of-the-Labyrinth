const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, bold } = require('discord.js');
const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, checkNextRound, endRound, setAdventure, cacheRoundRn } = require('../orcustrators/adventureOrcustrator');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getEmoji, getColor } = require('../util/elementUtil');
const { randomAuthorTip } = require('../util/embedUtil');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');

const mainId = "readymove";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		const delverArchetypeTemplate = getArchetype(delver.archetype);
		const embed = delverArchetypeTemplate.predict(new EmbedBuilder().setColor(getColor(adventure.room.element)), adventure)
		if (!embed.data.author) {
			embed.setAuthor(randomAuthorTip());
		}
		const enemyOptions = [];
		for (let i = 0; i < adventure.room.enemies.length; i++) {
			const enemy = adventure.room.enemies[i];
			if (enemy.hp > 0) {
				const optionPayload = {
					label: enemy.name,
					value: `enemy${SAFE_DELIMITER}${i}`
				};
				const miniPredict = trimForSelectOptionDescription(delverArchetypeTemplate.miniPredict(enemy));
				if (miniPredict) {
					optionPayload.description = miniPredict;
				}
				enemyOptions.push(optionPayload)
			}
		}
		const delverOptions = adventure.delvers.map((ally, i) => {
			const optionPayload = {
				label: ally.name,
				value: `delver${SAFE_DELIMITER}${i}`
			};
			const miniPredict = trimForSelectOptionDescription(delverArchetypeTemplate.miniPredict(ally));
			if (miniPredict) {
				optionPayload.description = miniPredict;
			}
			return optionPayload;
		});
		const components = [];
		const usableMoves = [];
		delver.gear.forEach(gear => { if (gear.durability > 0) { usableMoves.push(gear) } });
		if (usableMoves.length < MAX_MESSAGE_ACTION_ROWS) {
			if (delver.getModifierStacks("Floating Mist Stance") > 0) {
				usableMoves.unshift({ name: "Floating Mist Punch" });
			} else if (delver.getModifierStacks("Iron Fist Stance") > 0) {
				usableMoves.unshift({ name: "Iron Fist Punch" });
			} else {
				usableMoves.unshift({ name: "Punch" });
			}
		}
		for (let i = 0; i < usableMoves.length; i++) {
			const { name: gearName, durability } = usableMoves[i];
			const { type, team } = getGearProperty(gearName, "targetingTags");
			const elementEmoji = getEmoji(gearName === "Iron Fist Punch" ? delver.element : getGearProperty(gearName, "element"));
			if (type === "single" || type.startsWith("blast")) {
				// Select Menu
				let targetOptions = [];
				if (team === "foe" || team === "any") {
					targetOptions = targetOptions.concat(enemyOptions);
				}

				if (team === "ally" || team === "any") {
					targetOptions = targetOptions.concat(delverOptions);
				}
				components.push(new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${gearName}${SAFE_DELIMITER}${i}`)
						.setPlaceholder(`${elementEmoji} Use ${gearName} ${durability ? `(${durability} durability) ` : ""}on...`)
						.addOptions(targetOptions)
				));
			} else {
				// Button
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${gearName}${SAFE_DELIMITER}${i}`)
						.setLabel(`Use ${gearName}${durability ? ` (${durability} durability)` : ""}`)
						.setEmoji(elementEmoji)
						.setStyle(ButtonStyle.Secondary)
				));
			}
		}
		interaction.reply({ embeds: [embed], components, ephemeral: true, fetchReply: true }).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const [_, startedDepth, round, moveName, actionRowIndex] = collectedInteraction.customId.split(SAFE_DELIMITER);
				const adventure = getAdventure(collectedInteraction.channelId);
				const delver = adventure?.delvers.find(delver => delver.id === collectedInteraction.user.id);
				if (adventure.room.round !== Number(round) || startedDepth !== adventure.depth.toString()) {
					return;
				}

				let confirmationText;
				if (collectedInteraction.isButton()) {
					// Add move to round list (overwrite exisiting readied move)
					const userIndex = adventure.getCombatantIndex(delver);
					const newMove = new Move(moveName, "gear", new CombatantReference(delver.team, userIndex))
						.setSpeedByCombatant(delver)
						.setPriority(getGearProperty(moveName, "priority") ?? 0);

					let targetText = "";
					const { type, team } = getGearProperty(moveName, "targetingTags");
					if (type === "all") {
						let targetCount = 0;
						if (team === "ally") {
							targetCount = adventure.delvers.length;
							targetText = "all allies";
						} else if (team === "foe") {
							targetCount = adventure.room.enemies.length;
							targetText = "all enemies";
						}
						for (let i = 0; i < targetCount; i++) {
							newMove.addTarget(new CombatantReference(team === "ally" ? "delver" : "enemy", i));
						}
					} else if (type.startsWith("random")) {
						const targetCount = Number(type.split(SAFE_DELIMITER)[1]) + adventure.getArtifactCount("Loaded Dice");
						if (team === "ally") {
							targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
						} else if (team === "foe") {
							targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
						}
						const { [`${moveName}${SAFE_DELIMITER}allies`]: cachedAllies, [`${moveName}${SAFE_DELIMITER}foes`]: cachedFoes } = cacheRoundRn(adventure, delver, moveName, getGearProperty(moveName, "rnConfig"));
						if (cachedAllies) {
							for (let i = 0; i < cachedAllies.length; i++) {
								newMove.addTarget(new CombatantReference("delver", cachedAllies[i]));
							}
						}
						if (cachedFoes) {
							for (let i = 0; i < cachedFoes.length; i++) {
								newMove.addTarget(new CombatantReference("enemy", cachedFoes[i]));
							}
						}
					} else if (type === "self") {
						newMove.addTarget(new CombatantReference("delver", userIndex));
					}

					let overwritten = false;
					for (let i = 0; i < adventure.room.moves.length; i++) {
						const { userReference } = adventure.room.moves[i];
						if (userReference.team === delver.team && userReference.index === userIndex) {
							adventure.room.moves.splice(i, 1);
							overwritten = true;
							break;
						}
					}
					adventure.room.moves.push(newMove);

					confirmationText = `**${collectedInteraction.member.displayName}** ${overwritten ? "switches to ready" : "readies"} **${moveName}**${type !== "none" && type !== "self" ? ` to use on **${targetText}**` : ""}.`;
				} else {
					// Add move to round list (overwrite exisiting readied move)
					const userIndex = adventure.getCombatantIndex(delver);
					const [targetTeam, unparsedIndex] = collectedInteraction.values[0].split(SAFE_DELIMITER);
					const targetIndex = parseInt(unparsedIndex);
					const targetIndices = [];
					const newMove = new Move(moveName, "gear", new CombatantReference(delver.team, userIndex))
						.setSpeedByCombatant(delver)
						.setPriority(getGearProperty(moveName, "priority") ?? 0);

					const targetType = getGearProperty(moveName, "targetingTags").type;
					const crystalShardCount = adventure.getArtifactCount("Crystal Shard");
					if (targetType.startsWith("blast") || (crystalShardCount > 0 && getGearProperty(moveName, "category") === "Spell")) {
						const blastRange = parseInt(targetType.split(SAFE_DELIMITER)[1] ?? 0);
						const range = crystalShardCount + blastRange;
						const targetTeamMaxIndex = targetTeam === "delver" ? adventure.delvers.length - 1 : adventure.room.enemies.length - 1;

						let targetsSelectedLeft = 0;
						for (let index = targetIndex - 1; targetsSelectedLeft < range && index >= 0; index--) {
							if (adventure.room.enemies[index].hp > 0) {
								targetsSelectedLeft++;
								targetIndices.unshift(index);
							}
						}

						targetIndices.push(targetIndex);

						let targetsSelectedRight = 0;
						for (let index = targetIndex + 1; targetsSelectedRight < range && index <= targetTeamMaxIndex; index++) {
							if (adventure.room.enemies[index].hp > 0) {
								targetsSelectedRight++;
								targetIndices.push(index);
							}
						}

						targetIndices.forEach(index => {
							newMove.addTarget(new CombatantReference(targetTeam, index));
						});
					} else {
						newMove.addTarget(new CombatantReference(targetTeam, targetIndex));
						targetIndices.push(targetIndex);
					}
					let overwritten = false;
					for (let i = 0; i < adventure.room.moves.length; i++) {
						const { userReference } = adventure.room.moves[i];
						if (userReference.team === delver.team && userReference.index === userIndex) {
							adventure.room.moves.splice(i, 1);
							overwritten = true;
							break;
						}
					}
					adventure.room.moves.push(newMove);

					const targets = targetIndices.map(index => bold(adventure.getCombatant({ team: targetTeam, index }).name));
					confirmationText = `${bold(collectedInteraction.member.displayName)} ${overwritten ? "switches to ready" : "readies"} ${bold(moveName)} to use on ${listifyEN(targets, false)}.`;
				}
				collectedInteraction.channel.send(confirmationText).then(() => {
					setAdventure(adventure);
				}).catch(console.error);
				if (checkNextRound(adventure)) {
					endRound(adventure, collectedInteraction.channel);
				}
			})

			collector.on("end", async (interactionCollection) => {
				await interactionCollection.first().update({ components: [] });
				interaction.deleteReply();
			})
		}).catch(console.error);
	}
);
