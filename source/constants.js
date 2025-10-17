const authPath = "../config/auth.json";
const { testGuildId, feedbackChannelId } = require(authPath);
const { SelectMenuLimits } = require("@sapphire/discord.js-utilities");
const { announcementsChannelId, lastPostedVersion } = require("../config/versionData.json");

module.exports = {
	// JS Constants
	MAX_SET_TIMEOUT: 2 ** 31 - 1,
	ZERO_WIDTH_WHITESPACE: "\u200B",

	// Discord Constants
	serverGuideMention: "<id:guide>",
	channelBrowserMention: "<id:customize>",
	DISCORD_ICON_URL: "https://cdn.discordapp.com/attachments/618523876187570187/1110265047516721333/discord-mark-blue.png",

	// Discord Instance Constants
	testGuildId,
	feedbackChannelId,
	announcementsChannelId,
	commandIds: {},

	// Internal Convention
	lastPostedVersion,
	authPath,
	SAFE_DELIMITER: "→",
	SKIP_INTERACTION_HANDLING: "❌",

	// Game Values
	GAME_VERSION: "v0.19.0",
	POTL_ICON_URL: "https://images-ext-1.discordapp.net/external/wclKLsXO0RRUYVqULk4xBWnqyeepTl4MPdQAvwmYA4w/https/cdn.discordapp.com/avatars/950469509628702740/97f4ae84c14c2b88fbf569de061bac88.webp",
	RN_TABLE_BASE: 16,
	MAX_DELVER_COUNT: Math.floor(SelectMenuLimits.MaximumOptionsLength / 3),
	EMPTY_SELECT_OPTION_SET: [{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players use the same select at the same time.", value: "empty" }],
	SURPASSING_VALUE: 250,
	ESSENCE_MATCH_STAGGER_FOE: 2,
	ESSENCE_MATCH_STAGGER_ALLY: -1,

	// Emoji Icons
	ICON_APPEASE: "🙇",
	ICON_ARCHETYPE: "🆔",
	ICON_CANCEL: "✖️",
	ICON_CHALLENGE: "🏆",
	ICON_CONFIRM: "✔️",
	ICON_CRITICAL: "💥",
	ICON_GOLD: "💰",
	ICON_INSPECT_SELF: "🔎",
	ICON_LIFE: "❤️",
	ICON_LOCKED: "🔐",
	ICON_MODIFY: "↔️",
	ICON_NEEDS_CONFIRMATION: "💬",
	ICON_PARTY_STATS: "📚",
	ICON_PET: "🐾",
	ICON_PREMIUM: "💎",
	ICON_READY_ITEM: "🧪",
	ICON_READY_MOVE: "⚔",
	ICON_RECHARGE_SPELLS: "🔋",
	ICON_SCOUTING: "🔭",
	ICON_SHARE_HP: "⚕️",
	ICON_STAGGER: "💫",
	ICON_UPGRADE: "⬆️"
};
