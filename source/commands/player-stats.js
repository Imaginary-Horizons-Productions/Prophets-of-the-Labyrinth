const { EmbedBuilder } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { isSponsor } = require('../util/fileUtil');
const { getArtifactCounts } = require('../artifacts/_artifactDictionary');
const { getCompany } = require('../orcustrators/companyOrcustrator');
const { getPlayer } = require('../orcustrators/playerOrcustrator');

const mainId = "player-stats";
const options = [
	{ type: "User", name: "user", description: "The user's mention", required: false }
];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Get the stats for a user (default: yourself)", null, false, false, 3000, options, subcommands,
	/** Get the stats on a user */
	(interaction) => {
		const user = interaction.options.getUser(options[0].name) || interaction.user;
		const { guildId } = interaction;
		let availability = getCompany(guildId)?.adventuring.has(user.id) ? "❌ Out on adventure" : "🟢 Available for adventure";
		if (isSponsor(user.id)) {
			availability = "💎 Premium (available for adventure)";
		}
		const player = getPlayer(user.id, guildId);
		let bestArchetype = "N/A";
		let highScore = 0;
		for (const archetype in player.archetypes) {
			const score = player.archetypes[archetype];
			if (score > highScore) {
				bestArchetype = archetype;
				highScore = score;
			}
		}
		const totalArtifacts = getArtifactCounts();
		interaction.reply({
			embeds: [new EmbedBuilder().setAuthor({ name: availability })
				.setTitle("Player Stats")
				.setDescription(`Total Score: ${Object.values(player.scores).map(score => score.total).reduce((total, current) => total += current)}`)
				.addFields(
					{ name: `Best Archetype: ${bestArchetype}`, value: `High Score: ${highScore}` },
					{ name: "Artifacts Collected", value: `${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)` }
				)
				.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })], ephemeral: true
		})
			.catch(console.error);
	}
);
