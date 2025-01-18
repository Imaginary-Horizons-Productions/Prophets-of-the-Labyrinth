const { Scaling } = require("../../classes");

module.exports = {
	/** @type {(base: number) => Scaling} */
	damageScalingGenerator: (base) => ({ description: `${base} + Power`, calculate: (user) => base + user.getPower() }),
	/** @type {Scaling} */
	archetypeActionDamageScaling: { description: "Power", calculate: (user) => user.getPower() },
	/** @type {(base: number) => Scaling} */
	kineticDamageScalingGenerator: (base) => ({ description: `${base} + Power + Bonus Speed`, calculate: (user) => base + user.getPower() + user.getBonusSpeed() }),
	/** @type {(base: number) => Scaling} */
	protectionScalingGenerator: (base) => ({ description: `${base} + 20% Bonus HP`, calculate: (user) => base + Math.floor(user.getBonusHP() / 5) })
};
