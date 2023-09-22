const { Enemy } = require("./Combatant");

class Room {
	/** @type {Enemy[]} */
	enemies = [];
	/** @type {{[enemyName: string]: number}} */
	enemyIdMap = {};
}

module.exports = {
	Room
}
