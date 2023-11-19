const { BuildError } = require("./BuildError");

class ModifierTemplate {
	/** Template for combatant buffs and debuffs
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {boolean} isBuffInput
	 * @param {boolean} isDebuffInput
	 * @param {number} turnDecrementInput
	 */
	constructor(nameInput, descriptionInput, isBuffInput, isDebuffInput, turnDecrementInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!isBuffInput && isBuffInput !== false) throw new BuildError("Nonfalse falsy isBuffInput");
		if (!isDebuffInput && isDebuffInput !== false) throw new BuildError("Nonfalse falsy isDebuffInput");
		if (!turnDecrementInput && turnDecrementInput !== 0) throw new BuildError("Nonzero falsy turnDecrementInput");

		this.name = nameInput;
		this.description = descriptionInput;
		this.isBuff = isBuffInput;
		this.isDebuff = isDebuffInput;
		this.turnDecrement = turnDecrementInput;
	}
	inverse = "";

	/** @param {string} modifierName */
	setInverse(modifierName) {
		this.inverse = modifierName;
		return this;
	}
};

module.exports = {
	ModifierTemplate
};
