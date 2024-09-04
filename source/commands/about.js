const { CommandWrapper } = require('../classes');
const { GAME_VERSION } = require('../constants');
const { embedTemplate } = require('../util/embedUtil');

const mainId = "about";
module.exports = new CommandWrapper(mainId, "Get info and contributors to PotL", null, false, true, 3000,
	(interaction) => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle(`Prophets of the Labyrinth ${GAME_VERSION}`)
					.setThumbnail(interaction.client.user.displayAvatarURL())
					.setDescription("A multiplayer roguelite dungeon crawl to play with Discord server members.")
					.addFields([
						{ name: "Design & Engineering", value: "Nathaniel Tseng ( <@106122478715150336> | [GitHub](https://github.com/ntseng) )" },
						{ name: "Dev & Review", value: "Henry Hu ( <@113108081990176768> | [Twitter](https://twitter.com/hdoubledh) )" },
						{ name: "Random Number Generator", value: "Alex Frank" },
						{ name: "Room Loader", value: "Michel Momeyer" },
						{ name: "Predict Balance", value: "Lucas Ensign" },
						{ name: "Inactive Developers", value: "Vivian Thach" },
						{ name: "Playtesting", value: "Ralph Beishline, Eric Hu, TheChreative, Jon Puddicombe" },
						{ name: "Embed Thumbnails & Icons", value: "[game-icons.net](https://game-icons.net/)" }
					])
			],
			ephemeral: true
		});
	}
);
