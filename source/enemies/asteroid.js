const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectNone } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");

const PATTERN = {
  "Fragment": "random", // can keep fragmenting before randomly exploding on a coin flip
  "Bolide Burst": "random"
}
function asteroidPattern(actionName) {
  return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Asteroid",
  "Earth",
  85,
  10,
  "2",
  0,
  "Fragment",
  false
).addAction({
  name: "Fragment",
  element: "Earth",
  description: `Inflict ${getEmoji("Earth")} damage to delver, and loses some health`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower()+30;
    const recoilDmg = 20;
    if (isCrit) {
      damage *= 2;
    }
    changeStagger(targets, "elementMatchFoe");
    return `${dealDamage(targets, user, damage, false, user.element, adventure) + dealDamage([user], user, recoilDmg, false, "Untyped", adventure)}`;
  },
  selector: selectRandomFoe,
  needsLivingTargets: true,
  next: asteroidPattern
}).addAction({
  name: "Bolide Burst",
  element: "Earth",
  description: `Sacrifice self to attack random combatants multiple times with ${getEmoji("Earth")} damage (number directed at delvers is proportional to current HP)`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower()+30;
    let numAttacks = 5;
    if (isCrit) {
      numAttacks *= 2;
    }
    const delverAttacks = Math.floor(numAttacks / user.hp * user.maxHP);
    const enemyAttacks = Math.ceil(numAttacks / user.hp * user.maxHP);
    let targetList = [];

    user.hp = 0; // rule out self from selection
    for (let i = 0; i < delverAttacks; i++) {
      const liveDelvers = adventure.delvers.filter(d => d.hp > 0);
      targetList.push(liveDelvers[adventure.generateRandomNumber(liveDelvers.length, "battle")]);
    }
    for (let i = 0; i < enemyAttacks; i++) {
      const liveEnemies = adventure.room.enemies.filter(e => e.hp > 0);
      targetList.push(liveEnemies[adventure.generateRandomNumber(liveEnemies.length, "battle")]);
    }
    let resultString = "";
    for (target of targetList) {
      resultString += dealDamage([target], user, damage, false, user.element, adventure);
      changeStagger([target], "elementMatchFoe");
    }
    return resultString;
  },
  selector: selectNone,
  needsLivingTargets: false,
  next: asteroidPattern
});
