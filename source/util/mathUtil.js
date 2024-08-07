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


module.exports = {
	anyDieSucceeds
};
