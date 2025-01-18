const { Combatant } = require("../../classes");

module.exports = {
	/** @type {(base: number) => ({description: string, calculate: (user: Combatant) => number})} */
	damageScalingGenerator: (base) => ({ description: `${base} + Power`, calculate: (user) => base + user.getPower() }),
	/** @type {{description: string, calculate: (user: Combatant) => number}} */
	archetypeActionDamageScaling: { description: "Power", calculate: (user) => user.getPower() },
	/** @type {(base: number) => ({description: string, calculate: (user: Combatant) => number})} */
	kineticDamageScalingGenerator: (base) => ({ description: `${base} + Power + Bonus Speed`, calculate: (user) => base + user.getPower() + user.getBonusSpeed() }),
	/** @type {(base: number) => ({description: string, calculate: (user: Combatant) => number})} */
	protectionScalingGenerator: (base) => ({ description: `${base} + 20% Bonus HP`, calculate: (user) => base + Math.floor(user.getBonusHP() / 5) })
};
