const { commandIds } = require("../constants");
const { parseExpression } = require("./mathUtil");

/** @type {Record<number, string>} */
const NUMBER_EMOJI = {
	0: '0️⃣',
	1: '1️⃣',
	2: '2️⃣',
	3: '3️⃣',
	4: '4️⃣',
	5: '5️⃣',
	6: '6️⃣',
	7: '7️⃣',
	8: '8️⃣',
	9: '9️⃣',
	10: '🔟'
};
/** @param {number} number */
function getNumberEmoji(number) {
	if (number in NUMBER_EMOJI) {
		return NUMBER_EMOJI[number];
	} else {
		return '#️⃣';
	}
}

/** Create a text-only ratio bar that fills left to right
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} barLength
 */
function generateTextBar(numerator, denominator, barLength) {
	const filledBlocks = Math.floor(barLength * numerator / denominator);
	let bar = "";
	for (let i = 0; i < barLength; i++) {
		if (filledBlocks > i) {
			bar += "▰";
		} else {
			bar += "▱";
		}
	}
	return bar;
}

/** Replace all \@{expression}s in `text` with the evaluation of the expression with `tagMap key` as `tagMap value`
 * @param {string} text
 * @param {Record<string, number>} tagMap
 */
function calculateTagContent(text, tagMap) {
	for (const tag in tagMap) {
		const tagPattern = `@{([^@{}]*?${tag}[^@{}]*?)}`;
		const tagText = new RegExp(tag, "g");

		for (const match of text.matchAll(new RegExp(tagPattern, "g"))) {
			const countExpression = match?.[1].replace(tagText, "n");
			if (countExpression) {
				let parsedExpression = parseExpression(countExpression, tagMap[tag]);
				if (typeof parsedExpression === "number" && !Number.isInteger(parsedExpression)) {
					parsedExpression = parsedExpression.toFixed(2);
				}
				text = text.replace(new RegExp(tagPattern), parsedExpression);
			}
		}
	}
	return text;
}

/** Calculates the English cojugation of the ordinal suffix (eg 1st, 2nd, 3rd)
 * @param {number} integer - the integer to calculate the suffix for
 */
function ordinalSuffixEN(integer) {
	let lastDigit = integer % 10;
	let tensDigit = integer % 100 / 10;
	switch (lastDigit) {
		case 1:
			if (tensDigit !== 1) {
				return `${integer}st`;
			}
		case 2:
			if (tensDigit !== 1) {
				return `${integer}nd`;
			}
		case 3:
			if (tensDigit !== 1) {
				return `${integer}rd`;
			}
		default:
			return `${integer}th`;
	}
}

/** @param {string} text */
function trimForSelectOptionDescription(text) {
	if (text.length > 100) {
		return `${text.slice(0, 99)}…`;
	} else {
		return text;
	}
}

/** Formats string array into Oxford English list syntax
 *  @param {string[]} texts
 *  @param {boolean} isMutuallyExclusive
 */
function listifyEN(texts, isMutuallyExclusive) {
	if (texts.length > 2) {
		const textsSansLast = texts.slice(0, texts.length - 1);
		if (isMutuallyExclusive) {
			return `${textsSansLast.join(", ")}, or ${texts[texts.length - 1]}`;
		} else {
			return `${textsSansLast.join(", ")}, and ${texts[texts.length - 1]}`;
		}
	} else if (texts.length === 2) {
		if (isMutuallyExclusive) {
			return texts.join(" or ");
		} else {
			return texts.join(" and ");
		}
	} else if (texts.length === 1) {
		return texts[0];
	} else {
		return "";
	}
}

/** generates a command mention, which users can click to shortcut them to using the command
 * @param {string} fullCommand for subcommands append a whitespace and the subcommandName
 */
function commandMention(fullCommand) {
	const [mainCommand] = fullCommand.split(" ");
	if (!(mainCommand in commandIds)) {
		return `\`/${fullCommand}\``;
	}

	return `</${fullCommand}:${commandIds[mainCommand]}>`;
}

/**
 * @param {boolean} shouldListifyExclusively
 * @param {string[]} entities
 * @param {string} singularVerb
 * @param {string} pluralVerb
 * @param {string} descriptor
 */
function joinAsStatement(shouldListifyExclusively, entities, singularVerb, pluralVerb, descriptor) {
	if (entities.length > 1) {
		return `${listifyEN(entities, shouldListifyExclusively)} ${pluralVerb} ${descriptor}`;
	} else if (entities.length === 1) {
		return `${entities[0]} ${singularVerb} ${descriptor}`;
	} else {
		return "";
	}
}

module.exports = {
	getNumberEmoji,
	generateTextBar,
	calculateTagContent,
	ordinalSuffixEN,
	trimForSelectOptionDescription,
	listifyEN,
	commandMention,
	joinAsStatement
};
