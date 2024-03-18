const { commandIds } = require("../constants");

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

/** @param {string?} tag */
function generateRuntimeTemplateStringRegExp(tag) {
	return new RegExp(`@{${tag ?? "[a-zA-Z]+"}}`, "g");
};

const operationMap = {
	'+': (first, second) => first + second,
	'~': (first, second) => first - second,
	'*': (first, second) => first * second,
	'/': (first, second) => first / second,
	'^': (first, second) => first ** second,
};

/** Calculate the value represented by a mathematical expression (supported operations: addition, subtration, multiplication, division, power)
 * @param {string} expression
 * @param {number} nValue - the value to replace "n" with
 */
function parseExpression(expression, nValue) {
	const operations = expression.replace(/[^\+~\*/\^]/g, "");
	const terms = expression.split(/[\+~\*/\^]/g).map(term => term === "n" ? nValue : Number(term));
	return terms.reduce((total, term, index) => operationMap[operations[index - 1]](total, term));
}

/** Replace all @{tag}s in the text with the evaluation of the expression in the tag with n as count
 * @param {string} text
 * @param {{tag: string, count: number}[]} tags
 */
function calculateTagContent(text, tags) {
	for (const { tag, count } of tags) {
		const taggedGlobal = new RegExp(`@{(.*?${tag}.*?)}`, "g");
		const untagged = new RegExp(tag, "g");
		const taggedSingle = new RegExp(`@{(.*?${tag}.*?)}`);

		for (const match of text.matchAll(taggedGlobal)) {
			const countExpression = match?.[1].replace(untagged, "n");
			if (countExpression) {
				let parsedExpression = parseExpression(countExpression, count);
				if (typeof parsedExpression === "number") {
					parsedExpression = parsedExpression.toFixed(2);
				}
				text = text.replace(taggedSingle, parsedExpression);
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

module.exports = {
	getNumberEmoji,
	generateTextBar,
	generateRuntimeTemplateStringRegExp,
	parseExpression,
	calculateTagContent,
	ordinalSuffixEN,
	trimForSelectOptionDescription,
	listifyEN,
	commandMention
};
