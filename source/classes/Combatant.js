class CombatantReference {
	/**
	 * @param {"delver" | "enemy" | "none"} teamInput
	 * @param {number} indexInput
	*/
	constructor(teamInput, indexInput) {
		this.team = teamInput;
		this.index = indexInput;
	}
};

class Gear {
	constructor(nameInput, durabilityInput) {
		this.name = nameInput;
		this.durability = durabilityInput;
	}
};

module.exports = {
	CombatantReference,
	Gear
};
