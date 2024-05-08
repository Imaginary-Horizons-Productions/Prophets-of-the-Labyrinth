const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger } = require("../util/combatantUtil.js");
const { isBuff } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

const asteroid = require("./asteroid.js")

const PATTERN = {
  "Call Asteroid": "Tremor Smash", // happens at most every other turn (avg every 4)
  "Damping Wallop": "Tremor Smash",
  "Tremor Smash": "random"
}
function earthlyKnightPattern(actionName) {
  return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Earthly Knight",
  "Earth",
  250,
  100,
  "6",
  0,
  "Tremor Smash",
  false
).addAction({
  name: "Damping Wallop",
  element: "Earth",
  description: `Inflict ${getEmoji("Earth")} damage and remove a buff`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + 40;
    changeStagger(targets, "elementMatchFoe");
    let resultString = ""
    for (target of targets) {
      resultString += dealDamage(target, user, damage, false, user.element, adventure);
      const targetBuffs = Object.keys(target.modifiers).filter(modifier => isBuff(modifier));
      const debuffIndex = adventure.generateRandomNumber(targetBuffs.length, "battle");
      const rolledDebuff = targetBuffs[debuffIndex];
      const wasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
      if (wasRemoved) {
        resultString += `${rolledDebuff} was lost.`;
      }
    }
    return resultString;
  },
  selector: selectRandomFoe,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Tremor Smash",
  element: "Earth",
  description: `Deal minor ${getEmoji("Earth")} to all foes and stagger them`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() - 35;
    if (isCrit) {
      damage *= 2;
    }
    changeStagger(targets, 3);
    return dealDamage(targets, user, damage, false, user.element, adventure);
  },
  selector: selectAllFoes,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Call Asteroid",
  element: "Untyped",
  description: "Summon an Asteroid",
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    spawnEnemy(asteroid, adventure);
    return "An Asteroid arrives on the battlefield.";
  },
  selector: selectNone,
  needsLivingTargets: false,
  next: earthlyKnightPattern
});
