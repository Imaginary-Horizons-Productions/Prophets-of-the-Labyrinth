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
		console.error(new Error(`Attempted to create markdown for unregistered application emoji: ${emojiName}`));
		return emojiName;
	}
}

const applicationEmojiPlaceholderRegExp = /@e{([\w\s]+)}/g;

/** Converts `@e{emojiName}` into the specified application emoji, used for places where inline injection via `getApplicationEmojiMarkdown()` can't be used (eg template config that is loaded before `client.on("Ready")`)
 * @param {string} text
 */
function injectApplicationEmojiMarkdown(text) {
	return text.replace(applicationEmojiPlaceholderRegExp, (_, group1) => getApplicationEmojiMarkdown(group1));
}

/** Converts `@e{emojiName}` into the emoji's name as a string, used for places where inline injection via `getApplicationEmojiMarkdown()` can't be used (eg template config that is loaded before `client.on("Ready")`) and markdown is not accepted
 * @param {string} text
 */
function injectApplicationEmojiName(text) {
	return text.replace(applicationEmojiPlaceholderRegExp, (_, group1) => group1);
}

module.exports = {
	setApplicationEmojiDictionary,
	sanitizeEmojiName,
	getApplicationEmojiMarkdown,
	injectApplicationEmojiMarkdown,
	injectApplicationEmojiName
}
