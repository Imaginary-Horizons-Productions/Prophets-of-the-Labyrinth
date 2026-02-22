const { TextInputBuilder, ModalBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder, InteractionContextType, MessageFlags, LabelBuilder, userMention, FileUploadBuilder } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { testGuildId, feedbackChannelId, SKIP_INTERACTION_HANDLING } = require('../constants');
const { EmbedLimits } = require('@sapphire/discord.js-utilities');

const mainId = "feedback";
module.exports = new CommandWrapper(mainId, "Provide PotL feedback and get an invite to the test server", PermissionFlagsBits.SendMessages, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	/** Open the modal associated with the feedback type to prompt more specific information */
	(interaction) => {
		if (!testGuildId || !feedbackChannelId) {
			interaction.reply({ content: "The test server is not yet configured to receive feedback, thanks for your patience.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		let titlePrefix;
		switch (interaction.options.getString("feedback-type")) {
			case "bug": {
				titlePrefix = "Bug Report: ";
				const inputIdTitle = "title";
				const inputIdSteps = "steps";
				const inputIdActual = "actual";
				const inputIdExpected = "expected";
				const inputIdImage = "image";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Bug Report")
					.addLabelComponents(
						new LabelBuilder().setLabel("Title")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdTitle)
									.setMaxLength(EmbedLimits.MaximumTitleLength - titlePrefix.length)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Steps to reproduce")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdSteps)
									.setStyle(TextInputStyle.Paragraph)
							),
						new LabelBuilder().setLabel("What happened")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdActual)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What I was expecting to happen")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdExpected)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Screenshot/Diagram")
							.setFileUploadComponent(
								new FileUploadBuilder().setCustomId(inputIdImage)
									.setMaxValues(1)
									.setRequired(false)
							)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue(inputIdTitle)}`)
						.addFields(
							{ name: "Reporter", value: userMention(modalSubmission.user.id) },
							{ name: "Steps to Reproduce", value: modalSubmission.fields.getTextInputValue(inputIdSteps) },
							{ name: "Actual Behavior", value: modalSubmission.fields.getTextInputValue(inputIdActual) },
							{ name: "Expected Behavior", value: modalSubmission.fields.getTextInputValue(inputIdExpected) }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const imageFileCollection = modalSubmission.fields.getUploadedFiles(inputIdImage);
					if (imageFileCollection) {
						const firstAttachment = imageFileCollection.first();
						if (firstAttachment) {
							embed.setImage(firstAttachment.url);
						}
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your bug report has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}.You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, flags: [MessageFlags.Ephemeral] })
						})
					})
				}).catch(console.error);
			} break;
			case "feature": {
				titlePrefix = "Feature Request: ";
				const inputIdTitle = "title";
				const inputIdUser = "user";
				const inputIdFunctionality = "functionality";
				const inputIdBenefit = "benefit";
				const inputIdImage = "image";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Feature Request")
					.addLabelComponents(
						new LabelBuilder().setLabel("Title")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdTitle)
									.setMaxLength(EmbedLimits.MaximumTitleLength - titlePrefix.length)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("For who?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdUser)
									.setPlaceholder("As a ___")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What kind of feature?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdFunctionality)
									.setPlaceholder("I'd like to ___")
									.setStyle(TextInputStyle.Paragraph)
							),
						new LabelBuilder().setLabel("Why?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdBenefit)
									.setPlaceholder("So that I can ___")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Diagram")
							.setFileUploadComponent(
								new FileUploadBuilder().setCustomId(inputIdImage)
									.setMaxValues(1)
									.setRequired(false)
							)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue(inputIdTitle)}`)
						.addFields(
							{ name: "Reporter", value: userMention(modalSubmission.user.id) },
							{ name: "User Demographic", value: modalSubmission.fields.getTextInputValue(inputIdUser) },
							{ name: "Functionality", value: modalSubmission.fields.getTextInputValue(inputIdFunctionality) },
							{ name: "Benefit", value: modalSubmission.fields.getTextInputValue(inputIdBenefit) }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const imageFileCollection = modalSubmission.fields.getUploadedFiles(inputIdImage);
					if (imageFileCollection) {
						const firstAttachment = imageFileCollection.first();
						if (firstAttachment) {
							embed.setImage(firstAttachment.url);
						}
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your feature request has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}. You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, flags: [MessageFlags.Ephemeral] })
						})
					})
				}).catch(console.error);
			} break;
			case "balance": {
				titlePrefix = "Balance Suggestion";
				const inputIdEntity = "entity";
				const inputIdDirection = "direction";
				const inputIdChange = "change";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Balance Suggestion")
					.setLabelComponents(
						new LabelBuilder().setLabel("What aspect of the game?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdEntity)
									.setPlaceholder("Eg gear/monster/item/etc.")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Is it overpowered or underpowered?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdDirection)
									.setPlaceholder("Compared to what?")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What is your suggested change?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId(inputIdChange)
									.setPlaceholder("What problem is this attempting to solve?")
									.setStyle(TextInputStyle.Paragraph)
							)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(titlePrefix)
						.addFields(
							{ name: "Game Entity", value: modalSubmission.fields.getTextInputValue(inputIdEntity) },
							{ name: "Direction", value: modalSubmission.fields.getTextInputValue(inputIdDirection) },
							{ name: "Suggested Change", value: modalSubmission.fields.getTextInputValue(inputIdChange) },
							{ name: "Reporter", value: userMention(modalSubmission.user.id) }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					modalSubmission.client.guilds.fetch(testGuildId).then(testGuild => {
						return testGuild.channels.fetch(feedbackChannelId);
					}).then(feedbackChannel => {
						feedbackChannel.createInvite({ maxAge: 0 }).then(invite => {
							feedbackChannel.send({ embeds: [embed] });
							modalSubmission.reply({ content: `Your balance suggestion has been recorded${errors.length > 0 ? `, but the following errors were encountered:\n- ${errors.join("\n- ")}` : ""}. You can join the Imaginary Horizons Productions test server to provide additional information here: ${invite.url}`, flags: [MessageFlags.Ephemeral] })
						})
					})
				}).catch(console.error);
			} break;
		}
	}
).setOptions(
	{
		type: "String",
		name: "feedback-type",
		description: "the type of feedback you'd like to provide",
		required: true,
		choices: [
			{ name: "Bug Report", value: "bug" },
			{ name: "Feature Request", value: "feature" },
			{ name: "Balance Suggestion", value: "balance" }
		]
	}
);
