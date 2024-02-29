const authPath = "../config/auth.json";
const { testGuildId, feedbackChannelId } = require(authPath);
const { announcementsChannelId, lastPostedVersion } = require("../config/versionData.json");

module.exports = {
	// JS Constants
	MAX_SET_TIMEOUT: 2 ** 31 - 1,
	ZERO_WIDTH_WHITESPACE: "\u200B",

	// Discord Constants
	MAX_MESSAGE_CONTENT_LENGTH: 2000,
	MAX_EMBED_AUTHOR_NAME_LENGTH: 256,
	MAX_EMBED_TITLE_LENGTH: 256,
	MAX_EMBED_DESCRIPTION_LENGTH: 4096,
	MAX_EMBED_FIELD_COUNT: 25,
	MAX_EMBED_FIELD_NAME_LENGTH: 256,
	MAX_EMBED_FIELD_VALUE_LENGTH: 1024,
	MAX_EMBED_FOOTER_LENGTH: 2048,
	MAX_EMBED_TOTAL_CHARACTERS: 6000,
	MAX_EMBEDS_PER_MESSAGE: 10,
	MAX_MESSAGE_ACTION_ROWS: 5,
	MAX_BUTTONS_PER_ROW: 5,
	MAX_SELECT_OPTIONS: 25,
	DISCORD_ICON_URL: "https://cdn.discordapp.com/attachments/618523876187570187/1110265047516721333/discord-mark-blue.png",

	// Discord Instance Constants
	testGuildId,
	feedbackChannelId,
	announcementsChannelId,

	// Internal Convention
	lastPostedVersion,
	authPath,
	SAFE_DELIMITER: "→",
	SKIP_INTERACTION_HANDLING: "❌",

	// Game Values
	GAME_VERSION: "v0.14.0",
	POTL_ICON_URL: "https://images-ext-1.discordapp.net/external/wclKLsXO0RRUYVqULk4xBWnqyeepTl4MPdQAvwmYA4w/https/cdn.discordapp.com/avatars/950469509628702740/97f4ae84c14c2b88fbf569de061bac88.webp",
	RN_TABLE_BASE: 16,
	MAX_DELVER_COUNT: Math.floor(module.exports.MAX_SELECT_OPTIONS / 3),
	EMPTY_SELECT_OPTION_SET: [{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players use the same select at the same time.", value: "empty" }],
	SURPASSING_VALUE: 250
};
