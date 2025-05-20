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
	const operations = expression.replace(/[^+~*/^]/g, "");
	const terms = expression.split(/[+~*/^]/g).map(term => term === "n" ? nValue : Number(term));
	return terms.reduce((total, term, index) => operationMap[operations[index - 1]](total, term));
}

/** Aggregate dice rolls into one comparison by summing geometric series (coefficeint + coefficient * ratio + coefficient * ratio **2...)
 *
 * Formula simplified because `r = 1 - c` for dice rolls
 * @param {number} coefficent
 * @param {number} ratio
 * @param {number} extraDice
 */
function anyDieSucceeds(successChance, extraDice) {
	return 1 - ((1 - successChance) ** (1 + extraDice));
};

/**
 * @param {Set} firstSet
 * @param {Set} secondSet
 */
function areSetContentsCongruent(firstSet, secondSet) {
	if (firstSet.size !== secondSet.size) {
		return false;
	}

	for (const element of firstSet) {
		if (!secondSet.has(element)) {
			return false;
		}
	}
	return true;
}

/** Convert an amount of time from a starting unit to a different one
 * @param {number} value
 * @param {"w" | "d" | "h" | "m" | "s" | "ms"} startingUnit
 * @param {"w" | "d" | "h" | "m" | "s" | "ms"} resultUnit
 */
function timeConversion(value, startingUnit, resultUnit) {
	const unknownUnits = [];
	let msPerStartUnit = 1;
	switch (startingUnit.toLowerCase()) {
		case "w":
			msPerStartUnit *= 7;
		case "d":
			msPerStartUnit *= 24;
		case "h":
			msPerStartUnit *= 60;
		case "m":
			msPerStartUnit *= 60;
		case "s":
			msPerStartUnit *= 1000;
		case "ms":
			msPerStartUnit *= 1;
			break;
		default:
			unknownUnits.push(startingUnit);
	}

	let msPerResultUnit = 1;
	switch (resultUnit.toLowerCase()) {
		case "w":
			msPerResultUnit *= 7;
		case "d":
			msPerResultUnit *= 24;
		case "h":
			msPerResultUnit *= 60;
		case "m":
			msPerResultUnit *= 60;
		case "s":
			msPerResultUnit *= 1000;
		case "ms":
			msPerResultUnit *= 1;
			break;
		default:
			unknownUnits.push(resultUnit);
	}
	if (!unknownUnits.length) {
		return value * msPerStartUnit / msPerResultUnit;
	} else {
		throw new Error(`Unknown unit used: ${unknownUnits.join(", ")} (allowed units: ms, s, m, h, d, w)`)
	}
}

/**
 * A utility wrapper for @function timeConversion that goes back in time from the current timestamp
 * @param {{w?: number,
 * 			d?: number,
 * 			h?: number,
 * 			m?: number,
 * 			s?: number,
 * 			ms?: number}} timeMap The amount of time to go back in the past
 */
function dateInPast(timeMap) {
	let nowTimestamp = new Date();
	for (key in timeMap) {
		nowTimestamp -= timeConversion(timeMap[key], key, 'ms');
	}
	return new Date(nowTimestamp);
}

/**
 * A utility wrapper for @function timeConversion that goes into the future from the current timestamp
 * @param {{w?: number,
* 			d?: number,
* 			h?: number,
* 			m?: number,
* 			s?: number,
* 			ms?: number}} timeMap The amount of time to go into the future
*/
function dateInFuture(timeMap) {
	let nowTimestamp = new Date();
	for (key in timeMap) {
		nowTimestamp += timeConversion(timeMap[key], key, 'ms');
	}
	return new Date(nowTimestamp);
}

module.exports = {
	parseExpression,
	anyDieSucceeds,
	areSetContentsCongruent,
	timeConversion,
	dateInPast,
	dateInFuture
};
