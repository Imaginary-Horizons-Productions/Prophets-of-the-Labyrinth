let emojiDictionary = {};

function setApplicationEmojiDictionary(dictionary) {
	emojiDictionary = dictionary;
}

/** replace whitespace with underscore
 * @param {string} emojiName
 */
function sanitizeEmojiName(emojiName) {
	return emojiName.split(" ").join("_");
}

/** @param {string} emojiName */
function getApplicationEmojiMarkdown(emojiName) {
	const sanitizedName = sanitizeEmojiName(emojiName);
	if (sanitizedName in emojiDictionary) {
		return `<:${sanitizedName}:${emojiDictionary[sanitizedName]}>`;
	} else {
		console.error(new Error(`Attempted to create mention for unregistered application emoji: ${emojiName}`));
		return emojiName;
	}
}

/** Converts `@e{emojiName}` into the specified application emoji, used for places where inline injection via `getApplicationEmojiMarkdown()` can't be used (eg template config that is loaded before `client.on("Ready")`)
 * @param {string} text
 */
function parseApplicationEmojiMarkdownTag(text) {
	for (const match of text.matchAll(/@e{(\w+)}/g)) {
		text = text.replace(/@e{(\w+)}/, getApplicationEmojiMarkdown(match[1]));
	}
	return text;
}

module.exports = {
	setApplicationEmojiDictionary,
	sanitizeEmojiName,
	getApplicationEmojiMarkdown,
	parseApplicationEmojiMarkdownTag
}
