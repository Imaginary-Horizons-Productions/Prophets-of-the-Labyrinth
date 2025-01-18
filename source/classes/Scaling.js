const { Combatant } = require("./Combatant");

class Scaling {
	/** @type {string} */
	description;
	/** @type {(user: Combatant) => number} */
	calculate;
}

module.exports = {
	Scaling
};
