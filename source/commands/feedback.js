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
			case "bug":
				titlePrefix = "Bug Report: ";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Bug Report")
					.addLabelComponents(
						new LabelBuilder().setLabel("Title")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("title")
									.setMaxLength(EmbedLimits.MaximumTitleLength - titlePrefix.length)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Steps to reproduce")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("steps")
									.setStyle(TextInputStyle.Paragraph)
							),
						new LabelBuilder().setLabel("What happened")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("actual")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What I was expecting to happen")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("expected")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Screenshot/diagram URL")
							.setFileUploadComponent(
								new FileUploadBuilder().setCustomId("image")
									.setMaxValues(1)
									.setRequired(false)
							)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue("title")}`)
						.addFields(
							{ name: "Reporter", value: userMention(modalSubmission.user.id) },
							{ name: "Steps to Reproduce", value: modalSubmission.fields.getTextInputValue("steps") },
							{ name: "Actual Behavior", value: modalSubmission.fields.getTextInputValue("actual") },
							{ name: "Expected Behavior", value: modalSubmission.fields.getTextInputValue("expected") }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const imageFileCollection = modalSubmission.fields.getUploadedFiles("image");
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
				break;
			case "feature":
				titlePrefix = "Feature Request: ";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Feature Request")
					.addLabelComponents(
						new LabelBuilder().setLabel("Title")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("title")
									.setMaxLength(EmbedLimits.MaximumTitleLength - titlePrefix.length)
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("For who?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("user")
									.setPlaceholder("As a ___")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What kind of feature?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("functionality")
									.setPlaceholder("I'd like to ___")
									.setStyle(TextInputStyle.Paragraph)
							),
						new LabelBuilder().setLabel("Why?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("benefit")
									.setPlaceholder("So that I can ___")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Diagram URL")
							.setFileUploadComponent(
								new FileUploadBuilder().setCustomId("image")
									.setMaxValues(1)
									.setRequired(false)
							)
					)
				);
				interaction.awaitModalSubmit({ filter: (incoming) => incoming.customId === `${SKIP_INTERACTION_HANDLING}${interaction.id}`, time: 300000 }).then(modalSubmission => {
					const errors = [];
					const embed = new EmbedBuilder().setAuthor({ name: modalSubmission.user.username, iconURL: modalSubmission.user.avatarURL() })
						.setTitle(`${titlePrefix}${modalSubmission.fields.getTextInputValue("title")}`)
						.addFields(
							{ name: "Reporter", value: userMention(modalSubmission.user.id) },
							{ name: "User Demographic", value: modalSubmission.fields.getTextInputValue("user") },
							{ name: "Functionality", value: modalSubmission.fields.getTextInputValue("functionality") },
							{ name: "Benefit", value: modalSubmission.fields.getTextInputValue("benefit") }
						);

					if (modalSubmission.user.hexAccentColor) {
						embed.setColor(modalSubmission.user.hexAccentColor);
					}

					const imageFileCollection = modalSubmission.fields.getUploadedFiles("image");
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
				break;
			case "balance":
				titlePrefix = "Balance Suggestion";
				interaction.showModal(new ModalBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setTitle("Balance Suggestion")
					.setLabelComponents(
						new LabelBuilder().setLabel("What aspect of the game?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("entity")
									.setPlaceholder("Eg gear/monster/item/etc.")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("Is it overpowered or underpowered?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("direction")
									.setPlaceholder("Compared to what?")
									.setStyle(TextInputStyle.Short)
							),
						new LabelBuilder().setLabel("What is your suggested change?")
							.setTextInputComponent(
								new TextInputBuilder().setCustomId("change")
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
							{ name: "Game Entity", value: modalSubmission.fields.getTextInputValue("entity") },
							{ name: "Direction", value: modalSubmission.fields.getTextInputValue("direction") },
							{ name: "Suggested Change", value: modalSubmission.fields.getTextInputValue("change") },
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
				break;
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
