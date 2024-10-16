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
	anyDieSucceeds,
	areSetContentsCongruent
};
