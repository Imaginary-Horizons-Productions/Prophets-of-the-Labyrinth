const { EmbedBuilder, Colors } = require("discord.js");
const { Adventure, ArtifactTemplate } = require("../classes");
const { POTL_ICON_URL } = require("../constants");
const { getEmoji } = require("./elementUtil");

/** Create a message embed with common settings */
function embedTemplate() {
	return new EmbedBuilder().setColor(Colors.Blurple)
		.setAuthor({ name: "Click here to vist the PotL GitHub", iconURL: POTL_ICON_URL, url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setURL("https://discord.com/api/oauth2/authorize?client_id=950469509628702740&permissions=397284665360&scope=applications.commands%20bot")
		.setFooter({ text: "Click the title link to add PotL to your server", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
}

/**
 * @param {ArtifactTemplate} artifactTemplate
 * @param {number} count
 * @param {Adventure?} adventure
 */
function generateArtifactEmbed(artifactTemplate, count, adventure) {
	const embed = embedTemplate()
		.setTitle(`${getEmoji(artifactTemplate.element)} ${artifactTemplate.name} x ${count}`)
		.setDescription(artifactTemplate.dynamicDescription(count))
		.addFields({ name: "Scaling", value: artifactTemplate.scalingDescription });
	if (artifactTemplate.flavorText) {
		embed.addFields(artifactTemplate.flavorText);
	}
	if (adventure) {
		const artifactCopy = Object.assign({}, adventure.artifacts[artifactTemplate.name]);
		delete artifactCopy["count"];
		Object.entries(artifactCopy).forEach(([statistic, value]) => {
			embed.addFields({ name: statistic, value: value.toString() });
		})
	}
	return embed;
}

module.exports = {
	embedTemplate,
	generateArtifactEmbed
};
