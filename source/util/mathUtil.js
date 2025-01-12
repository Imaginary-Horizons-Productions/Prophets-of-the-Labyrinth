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

module.exports = {
	parseExpression,
	anyDieSucceeds,
	areSetContentsCongruent
};
