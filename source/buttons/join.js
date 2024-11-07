const { EmbedBuilder } = require('discord.js');
const { ButtonWrapper, Delver } = require('../classes');
const { MAX_DELVER_COUNT, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { isSponsor } = require('../util/fileUtil');
const { getCompany, setCompany } = require('../orcustrators/companyOrcustrator');
const { getAdventure, setAdventure, fetchRecruitMessage } = require('../orcustrators/adventureOrcustrator');
const { getPlayer } = require('../orcustrators/playerOrcustrator');

const mainId = "join";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Join an existing adventure */
	async (interaction, [guildId, adventureId, context]) => {
		const company = getCompany(interaction.guildId);
		if (!isSponsor(interaction.user.id) && company.adventuring.has(interaction.user.id)) {
			interaction.reply({ content: "Delving in more than one adventure per server is a premium perk. Use `/support` for more details.", ephemeral: true });
			return;
		}

		const adventure = getAdventure(adventureId);
		if (!adventure) {
			interaction.message.edit({ components: [] });
			interaction.reply({ content: "The adventure you tried joining could not be found.", ephemeral: true });
			return;
		}

		if (adventure.state !== "config") {
			interaction.reply({ content: "This adventure has already started, but you can recruit for your own with `/delve`.", ephemeral: true });
			return;
		}

		if (adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You are already part of this adventure!", ephemeral: true });
			return;
		}

		let recruitMessage = interaction.message;
		if (context === "invite") {
			const guild = await interaction.client.guilds.fetch(guildId);
			const thread = await guild.channels.fetch(adventureId);
			recruitMessage = await fetchRecruitMessage(thread, adventure.messageIds.recruit);
		}
		if (adventure.delvers.length === MAX_DELVER_COUNT) {
			recruitMessage.edit({ components: [] });
			interaction.update({ content: `The maximum number of delvers on an adventure is ${MAX_DELVER_COUNT}.`, components: [], ephemeral: true });
			return;
		}

		// Update game logic
		const delver = new Delver(interaction.user.id, interaction.user.username, adventureId);
		const player = getPlayer(interaction.user.id, interaction.guildId);
		if (player.favoritePet !== "") {
			delver.pet = player.favoritePet;
		}
		adventure.delvers.push(delver);
		adventure.lives++;
		adventure.gainGold(50);
		setAdventure(adventure);
		company.adventuring.add(interaction.user.id);
		setCompany(company);

		// Welcome player to thread
		interaction.client.guilds.fetch(guildId).then(guild => {
			return guild.channels.fetch(adventureId);
		}).then(thread => {
			thread.send(`<@${interaction.user.id}> joined the adventure!`);
		});

		// Update recruit message
		let partyList = `<@${adventure.leaderId}> 👑`;
		for (let delver of adventure.delvers) {
			if (delver.id !== adventure.leaderId) {
				partyList += `\n<@${delver.id}>`;
			}
		}
		const embeds = [];
		const [{ data: recruitEmbed }] = recruitMessage.embeds;
		if (recruitEmbed) {
			embeds.push(new EmbedBuilder(recruitEmbed).spliceFields(0, 1, { name: `${adventure.delvers.length} Party Member${adventure.delvers.length === 1 ? "" : "s"}`, value: partyList }));
		}
		let components = recruitMessage.components;
		if (adventure.delvers.length === MAX_DELVER_COUNT) {
			components = [];
		}
		recruitMessage.edit({ embeds, components });
		if (context === "invite") {
			interaction.update({ components: [] })
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE })
		}
	}
);
