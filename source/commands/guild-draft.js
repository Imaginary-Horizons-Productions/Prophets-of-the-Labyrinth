const crypto = require("crypto");
const { PermissionFlagsBits, InteractionContextType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, TextDisplayBuilder, ComponentType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { ICON_CONFIRM, ICON_CANCEL, SKIP_INTERACTION_HANDLING, SAFE_DELIMITER } = require('../constants');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');
const { timeConversion, extractFromRNTable } = require('../util/mathUtil');
const { getAllArchetypeNames, getArchetype } = require('../archetypes/_archetypeDictionary');
const { PET_NAMES, getPetTemplate } = require('../pets/_petDictionary');

const customIdPrefix = `${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}`;

const mainId = "guild-draft";
module.exports = new CommandWrapper(mainId, "Draft licenses from the Adventuring Guild to delve as different archetypes or bring different pets", PermissionFlagsBits.ViewChannel, false, [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel], 3000,
	(interaction) => {
		const player = getPlayer(interaction.user.id, interaction.guild.id);
		const useFreeRoll = player.nextFreeRoll <= Date.now();
		if (!useFreeRoll && !(player.bonusDrafts > 0)) {
			interaction.reply({ content: `You don't have any bonus drafts available at the moment. Your next free draft is in <t:${Math.floor(player.nextFreeRoll / 1000)}:R>.`, flags: MessageFlags.Ephemeral });
			return;
		}

		// Random Numbers generated from player id and draft count to avoid players seeing results then rerolling before committing draft
		const rnTable = crypto.createHash("sha256").update(`${interaction.user.id}${player.draftCount}`).digest("hex");
		let rnIndex = 0;

		const archetypePool = getAllArchetypeNames();
		const archetypeOptions = [];
		for (let i = 0; i < 2; i++) {
			const randomIndex = extractFromRNTable(rnTable, archetypePool.length, rnIndex);
			rnIndex = (rnIndex + 1) % rnTable.length;
			archetypeOptions.push(archetypePool.splice(randomIndex, 1)[0]);
		}

		const petPool = [...PET_NAMES];
		const petOptions = [];
		for (let i = 0; i < 2; i++) {
			const randomIndex = extractFromRNTable(rnTable, petPool.length, rnIndex);
			rnIndex = (rnIndex + 1) % rnTable.length;
			petOptions.push(petPool.splice(randomIndex, 1)[0]);
		}

		let selectedArchetype = null;
		let selectedPet = null;
		let influenceBonus = 0;
		const influenceLabel = "Random (+10% Guild Influence)";
		/** @type {import('discord.js').APIContainerComponent} */
		const containerPayload = { type: ComponentType.Container, accent_color: Colors.Aqua };
		const SPECIALIZATIONS_PER_ARCHETYPE = 4;
		const MAX_PET_LEVEL = 4;
		const containerComponents = [new TextDisplayBuilder().setContent(`# The Guild Draft\nDrafting licenses from the Adventuring Guild allows you to delve into labyrinths as different archetypes and bring different pets. Drafting also earns some Guild Influence, which is used for unlocking archetype specializations and leveling-up pets.\n\n${useFreeRoll ? "This draft will use your weekly free draft." : `This draft will use 1 of your ${player.bonusDrafts} bonus drafts.`} The draft will be recorded when you make the final selection (pet).\n### Duplicates\nUnlocking new Archetype Specializations require drafting a duplicate of that Archetype and spending some Guild Influence. Archetypes currently have ${SPECIALIZATIONS_PER_ARCHETYPE} Specializations to unlock.\n\nLeveling-up a pet requires drafting a duplicate of that pet and spending some Guild Influence. Pet levels currently max out at Level ${MAX_PET_LEVEL}.\n## Available Archetypes`)];
		interaction.reply({
			components: [
				{
					...containerPayload,
					components: containerComponents.concat(
						new ActionRowBuilder().setComponents(
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${archetypeOptions[0]}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(archetypeOptions[0]),
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${archetypeOptions[1]}`)
								.setStyle(ButtonStyle.Primary)
								.setLabel(archetypeOptions[1]),
							new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}influence`)
								.setStyle(ButtonStyle.Secondary)
								.setLabel(influenceLabel)
						)
					)
				}
			],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			withResponse: true
		}).then(response => response.resource.message).then(reply => {
			const archetypeCollector = reply.createMessageComponentCollector({ filter: (interaction) => interaction.customId.startsWith(`${customIdPrefix}0`), max: 1 });
			archetypeCollector.on("collect", collectedInteraction => {
				//TODONOW race condition check
				selectedArchetype = collectedInteraction.customId.split(SAFE_DELIMITER)[2];
				const disabledArchetypeRow = new ActionRowBuilder();
				for (const option of archetypeOptions.concat("influence")) {
					disabledArchetypeRow.addComponents(
						new ButtonBuilder().setCustomId(`${customIdPrefix}0${SAFE_DELIMITER}${option}`)
							.setStyle(option === "influence" ? ButtonStyle.Secondary : ButtonStyle.Primary)
							.setEmoji(selectedArchetype === option ? ICON_CONFIRM : ICON_CANCEL)
							.setLabel(option === "influence" ? influenceLabel : option)
							.setDisabled(true)
					)
				}
				if (selectedArchetype === "influence") {
					selectedArchetype = archetypeOptions[extractFromRNTable(rnTable, 2, rnIndex)];
					rnIndex = (rnIndex + 1) % rnTable.length;
					influenceBonus++;
				}

				const archetypeTemplate = getArchetype(selectedArchetype);
				containerComponents.push(disabledArchetypeRow, new TextDisplayBuilder().setContent(`-# ${archetypeTemplate.tips[extractFromRNTable(rnTable, archetypeTemplate.tips.length, rnIndex)]}\n## Available Pets`));
				rnIndex = (rnIndex + 1) % rnTable.length;
				collectedInteraction.update({
					components: [
						{
							...containerPayload,
							components: containerComponents.concat(
								new ActionRowBuilder().addComponents(
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${petOptions[0]}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(petOptions[0]),
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${petOptions[1]}`)
										.setStyle(ButtonStyle.Primary)
										.setLabel(petOptions[1]),
									new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}influence`)
										.setStyle(ButtonStyle.Secondary)
										.setLabel(influenceLabel)
								)
							)
						}
					]
				});
			})

			const petCollector = reply.createMessageComponentCollector({ filter: (interaction) => interaction.customId.startsWith(`${customIdPrefix}1`), max: 1 });
			petCollector.on("collect", collectedInteraction => {
				//TODONOW race condition check
				selectedPet = collectedInteraction.customId.split(SAFE_DELIMITER)[2];
				const disabledPetRow = new ActionRowBuilder();
				for (const option of petOptions.concat("influence")) {
					disabledPetRow.addComponents(
						new ButtonBuilder().setCustomId(`${customIdPrefix}1${SAFE_DELIMITER}${option}`)
							.setStyle(option === "influence" ? ButtonStyle.Secondary : ButtonStyle.Primary)
							.setEmoji(selectedPet === option ? ICON_CONFIRM : ICON_CANCEL)
							.setLabel(option === "influence" ? influenceLabel : option)
							.setDisabled(true)
					)
				}
				if (selectedPet === "influence") {
					selectedPet = petOptions[extractFromRNTable(rnTable, 2, rnIndex)];
					rnIndex = (rnIndex + 1) % rnTable.length;
					influenceBonus++;
				}
				const petTemplate = getPetTemplate(selectedPet);
				containerComponents.push(disabledPetRow, new TextDisplayBuilder().setContent(`-# ${petTemplate.tips[extractFromRNTable(rnTable, petTemplate.tips.length, rnIndex)]}`));
				rnIndex = (rnIndex + 1) % rnTable.length;

				// Uniform: 20, 30, 40, or 50 Guild Influence
				const influenceRoll = 20 + (10 * extractFromRNTable(rnTable, 4, rnIndex));
				rnIndex = (rnIndex + 1) % rnTable.length;
				// Skipped Choices yield 25% bonus Guild Influence
				const totalInfluence = Math.ceil(influenceRoll + (influenceRoll * influenceBonus / 4));
				player.guildInfluence += totalInfluence;
				if (selectedArchetype in player.archetypes) {
					player.archetypes[selectedArchetype].specializationsUnlocked = Math.min(player.archetypes[selectedArchetype].specializationsUnlocked + 1, SPECIALIZATIONS_PER_ARCHETYPE);
				} else {
					player.archetypes[selectedArchetype] = { specializationsUnlocked: 1, highScore: 0 };
				}

				if (selectedPet in player.pets) {
					player.pets[selectedPet] = Math.min(player.pets[selectedPet] + 1, MAX_PET_LEVEL);
				} else {
					player.pets[selectedPet] = 1;
				}
				if (!useFreeRoll) {
					player.bonusDrafts--;
				} else {
					player.nextFreeRoll = Date.now() + timeConversion(1, "w", "ms");
				}
				player.draftCount++;
				setPlayer(player);
				containerComponents.push(new TextDisplayBuilder().setContent(`You gained ${totalInfluence} Guild Influence!`))
				collectedInteraction.update({
					components: [{ ...containerPayload, components: containerComponents }]
				});
			})
		})
	}
);
