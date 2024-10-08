const { BuildError } = require("./BuildError");

class ModifierTemplate {
	/** Template for combatant buffs and debuffs
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} emojiMarkdown
	 * @param {boolean} isBuffInput
	 * @param {boolean} isDebuffInput
	 * @param {number | "all"} turnDecrementInput
	 */
	constructor(nameInput, descriptionInput, emojiMarkdown, isBuffInput, isDebuffInput, turnDecrementInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!emojiMarkdown) throw new BuildError("Falsy emojiMarkdown");
		if (!isBuffInput && isBuffInput !== false) throw new BuildError("Nonfalse falsy isBuffInput");
		if (!isDebuffInput && isDebuffInput !== false) throw new BuildError("Nonfalse falsy isDebuffInput");
		if (!turnDecrementInput && turnDecrementInput !== 0) throw new BuildError("Nonzero falsy turnDecrementInput");

		this.name = nameInput;
		this.description = descriptionInput;
		this.emoji = emojiMarkdown;
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
