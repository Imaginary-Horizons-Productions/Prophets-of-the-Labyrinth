/** Calculates the sum of a geometric series (coefficeint + coefficient * ratio + coefficient * ratio **2...)
 * @param {number} coefficent
 * @param {number} ratio
 * @param {number} terms
 */
function sumGeometricSeries(coefficent, ratio, terms) {
	return coefficent * (1 - ratio ** terms) / (1 - ratio);
};


module.exports = {
	sumGeometricSeries
};
