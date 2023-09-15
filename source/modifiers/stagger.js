const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Stagger",
	"This combatant gets Stunned at @{poise} Stagger. Lose @{roundDecrement} stack per round.",
	false,
	false,
	false,
	1
);
