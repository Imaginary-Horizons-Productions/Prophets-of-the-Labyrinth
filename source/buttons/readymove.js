const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, MAX_MESSAGE_ACTION_ROWS, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArchetype } = require('../archetypes/_archetypeDictionary');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getEmoji, getColor } = require('../util/elementUtil');
const { gearToEmbedField, randomAuthorTip } = require('../util/embedUtil');
const { trimForSelectOptionDescription, listifyEN } = require('../util/textUtil');
const { getNames } = require('../util/combatantUtil');

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
		const embed = new EmbedBuilder().setColor(getColor(adventure.room.element))
			.setAuthor(randomAuthorTip())
			.setTitle("Readying a Move")
			.setDescription(`Your ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.\n\nPick one option from below as your move for this round:`);
		const enemyOptions = [];
		const miniPredictBuilder = getArchetype(delver.archetype).miniPredict;
		const enemyNames = getNames(adventure.room.enemies, adventure);
		for (let i = 0; i < adventure.room.enemies.length; i++) {
			const enemy = adventure.room.enemies[i];
			if (enemy.hp > 0) {
				const optionPayload = {
					label: enemyNames[i],
					value: `enemy${SAFE_DELIMITER}${i}`
				};
				const miniPredict = trimForSelectOptionDescription(miniPredictBuilder(enemy));
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
			const miniPredict = trimForSelectOptionDescription(miniPredictBuilder(ally));
			if (miniPredict) {
				optionPayload.description = miniPredict;
			}
			return optionPayload;
		});
		const components = [];
		const usableMoves = delver.gear.filter(gear => gear.durability > 0);
		if (usableMoves.length < MAX_MESSAGE_ACTION_ROWS) {
			usableMoves.unshift({ name: "Punch", durability: Infinity });
		}
		for (let i = 0; i < usableMoves.length; i++) {
			const { name: gearName, durability } = usableMoves[i];
			embed.addFields(gearToEmbedField(gearName, durability, delver));
			const { type, team } = getGearProperty(gearName, "targetingTags");
			const elementEmoji = getEmoji(getGearProperty(gearName, "element"));
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
						.setPlaceholder(`${elementEmoji} Use ${gearName} on...`)
						.addOptions(targetOptions)
				));
			} else {
				// Button
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}${SAFE_DELIMITER}${adventure.depth}${SAFE_DELIMITER}${adventure.room.round}${SAFE_DELIMITER}${gearName}${SAFE_DELIMITER}${i}`)
						.setLabel(`Use ${gearName}`)
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
					const newMove = new Move(new CombatantReference(delver.team, userIndex), "gear", delver.crit)
						.setName(moveName)
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
						const targetCount = Number(type.split(SAFE_DELIMITER)[1]);
						let poolSize = 0;
						if (team === "ally") {
							poolSize = adventure.delvers.length;
							targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
						} else if (team === "foe") {
							poolSize = adventure.room.enemies.length;
							targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
						}
						for (let i = 0; i < targetCount; i++) {
							newMove.addTarget(new CombatantReference(team === "ally" ? "delver" : "enemy", adventure.generateRandomNumber(poolSize, "battle")));
						}
					} else if (type === "self") {
						newMove.addTarget(new CombatantReference("delver", userIndex));
					} else if (type === "none") {
						newMove.addTarget(new CombatantReference("none", -1));
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
					const newMove = new Move(new CombatantReference(delver.team, userIndex), "gear", delver.crit)
						.setName(moveName)
						.setSpeedByCombatant(delver)
						.setPriority(getGearProperty(moveName, "priority") ?? 0);

					const targetType = getGearProperty(moveName, "targetingTags").type;
					const crystalShardCount = adventure.getArtifactCount("Crystal Shard");
					if (targetType.startsWith("blast") || (crystalShardCount > 0 && getGearProperty(moveName, "category") === "Spell")) {
						const blastRange = parseInt(targetType.split(SAFE_DELIMITER)[1] ?? 0);
						const range = crystalShardCount + blastRange;
						const targetTeamMaxIndex = targetTeam === "delver" ? adventure.delvers.length - 1 : adventure.room.enemies.length - 1;

						let targetsSelectedLeft = 0;
						let prebuffedMinIndex = targetIndex;
						for (let index = targetIndex - 1; targetsSelectedLeft < range && index >= 0; index--) {
							if (adventure.room.enemies[index].hp > 0) {
								targetsSelectedLeft++;
								targetIndices.unshift(index);
								if (targetsSelectedLeft <= blastRange) {
									prebuffedMinIndex = index;
								}
							}
						}

						targetIndices.push(targetIndex);

						let targetsSelectedRight = 0;
						let prebuffedMaxIndex = targetIndex;
						for (let index = targetIndex + 1; targetsSelectedRight < range && index <= targetTeamMaxIndex; index++) {
							if (adventure.room.enemies[index].hp > 0) {
								targetsSelectedRight++;
								targetIndices.push(index);
								if (targetsSelectedRight <= blastRange) {
									prebuffedMaxIndex = index;
								}
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

					const targets = getNames(targetIndices.map(index => adventure.getCombatant({ team: targetTeam, index })), adventure).map(name => `**${name}**`);
					confirmationText = `**${collectedInteraction.member.displayName}** ${overwritten ? "switches to ready" : "readies"} **${moveName}** to use on ${listifyEN(targets, false)}.`;
				}
				collectedInteraction.channel.send(confirmationText).then(() => {
					setAdventure(adventure);
				}).catch(console.error);
				if (checkNextRound(adventure)) {
					endRound(adventure, collectedInteraction.channel);
				}
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		}).catch(console.error);
	}
);
