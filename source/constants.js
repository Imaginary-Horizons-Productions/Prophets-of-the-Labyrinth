exports.MAX_SET_TIMEOUT = 2 ** 31 - 1;
exports.MAX_MESSAGE_ACTION_ROWS = 5;
exports.MAX_BUTTONS_PER_ROW = 5;
exports.MAX_SELECT_OPTIONS = 25;
exports.MAX_EMBED_TITLE_LENGTH = 256;

exports.authPath = "../config/auth.json";
const { testGuildId, feedbackChannelId } = require(exports.authPath);
exports.testGuildId = testGuildId;
exports.feedbackChannelId = feedbackChannelId;
const { announcementsChannelId, lastPostedVersion } = require("../config/versionData.json");
exports.announcementsChannelId = announcementsChannelId;
exports.lastPostedVersion = lastPostedVersion;
exports.DISCORD_ICON_URL = "https://cdn.discordapp.com/attachments/618523876187570187/1110265047516721333/discord-mark-blue.png";

exports.SAFE_DELIMITER = "→";
exports.ZERO_WIDTH_WHITESPACE = "\u200B";
exports.POTL_ICON_URL = "https://images-ext-1.discordapp.net/external/wclKLsXO0RRUYVqULk4xBWnqyeepTl4MPdQAvwmYA4w/https/cdn.discordapp.com/avatars/950469509628702740/97f4ae84c14c2b88fbf569de061bac88.webp";

exports.maxDelverCount = Math.floor(exports.MAX_SELECT_OPTIONS / 3);
