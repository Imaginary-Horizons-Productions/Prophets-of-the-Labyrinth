const { CommandWrapper } = require('../classes');
const { POTL_ICON_URL } = require('../constants');
const { embedTemplate } = require('../util/embedUtil');
const { isSponsor } = require('../util/fileUtil');
const { getArtifactCounts } = require('../artifacts/_artifactDictionary');
const { getCompany } = require('../orcustrators/companyOrcustrator');
const { getPlayer } = require('../orcustrators/playerOrcustrator');

const mainId = "player-stats";
module.exports = new CommandWrapper(mainId, "Get the overall PotL stats for a user", null, false, false, 3000,
	(interaction) => {
		const user = interaction.options.getUser("user") || interaction.user;
		const { guildId } = interaction;
		let availability = getCompany(guildId)?.adventuring.has(user.id) ? "❌ Out on adventure" : "🟢 Available for adventure";
		if (isSponsor(user.id)) {
			availability = "💎 Available for adventure (Premium)";
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
			embeds: [
				embedTemplate().setTitle(`Player Stats: ${user.displayName}`)
					.setThumbnail(POTL_ICON_URL)
					.setDescription(`${availability}\n\nTotal Score: ${Object.values(player.scores).map(score => score.total).reduce((total, current) => total += current)}`)
					.addFields(
						{ name: `Best Archetype: ${bestArchetype}`, value: `High Score: ${highScore}` },
						{ name: "Artifacts Collected", value: `${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)` }
					)
			],
			ephemeral: true
		});
	}
).setOptions(
	{ type: "User", name: "user", description: "The user's mention (default: yourself)", required: false }
);
