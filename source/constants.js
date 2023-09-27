const authPath = "../config/auth.json";
const { testGuildId, feedbackChannelId } = require(authPath);
const { announcementsChannelId, lastPostedVersion } = require("../config/versionData.json");

module.exports = {
	// JS Constants
	MAX_SET_TIMEOUT: 2 ** 31 - 1,
	ZERO_WIDTH_WHITESPACE: "\u200B",

	// Discord Constant
	MAX_MESSAGE_ACTION_ROWS: 5,
	MAX_BUTTONS_PER_ROW: 5,
	MAX_SELECT_OPTIONS: 25,
	MAX_EMBED_TITLE_LENGTH: 256,
	DISCORD_ICON_URL: "https://cdn.discordapp.com/attachments/618523876187570187/1110265047516721333/discord-mark-blue.png",

	// Discord Instance Constants
	testGuildId,
	feedbackChannelId,
	announcementsChannelId,

	// Internal Convention
	lastPostedVersion,
	authPath,
	SAFE_DELIMITER: "→",
	POTL_ICON_URL: "https://images-ext-1.discordapp.net/external/wclKLsXO0RRUYVqULk4xBWnqyeepTl4MPdQAvwmYA4w/https/cdn.discordapp.com/avatars/950469509628702740/97f4ae84c14c2b88fbf569de061bac88.webp",

	// Game Values
	maxDelverCount: Math.floor(module.exports.MAX_SELECT_OPTIONS / 3),
};
