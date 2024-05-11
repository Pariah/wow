function test() {
  let testvar = getWarlockAssignments();
  console.log(testvar);
}

function getDataBySpecID(specid, key) {
    const data = SPECID[specid];
    return data ? data[key] : 'Unknown';
}

function getData(nick, key) {
    const data = ROSTER.find(row => row.nick === nick);
    return data ? data[key] || getDataBySpecID(data.specid, key) : 'Unknown';
}

function getRole(nick) {
  const role = getData(nick, 'role');
  return (role === 'Melee' || role === 'Ranged') ? 'DPS' : role;
}

function getByType(comp, type, value, ...values) {
  return comp.filter(nick => value === getData(nick, type) || values.includes(getData(nick, type)));
}

function getAllByType(type, value, ...values) {
  const allNicks = ROSTER.map(row => row.nick);
  return allNicks.filter(nick => value === getData(nick, type) || values.includes(getData(nick, type)));
}

function getCooldown(comp, type, subtype = [], ...subtypes) {
  let cooldowns;
  if (subtype.length === 1) {
    cooldowns = subtypes.length === 0 ? COOLDOWN[type][subtype[0]] : subtypes.reduce((acc, curr) => [...acc, ...COOLDOWN[type][subtype[0]][curr]], []);
  } else {
    cooldowns = subtype.reduce((acc, curr) => [...acc, ...COOLDOWN[type][curr]], []);
  }
  return comp.filter(nick => cooldowns.includes(getData(nick, 'specid')));
}

function getAbility(comp, ability, ...abilities) {
  const abilityList = abilities.length === 0 ? ABILITY[ability] : ABILITY[ability][abilities];
  return comp.filter(nick => abilityList.includes(getData(nick, 'specid')));
}

// TODO: Add support to options that have multiple values; i.e. 'parse','specid','63','64', etc.
function orderBy(comp, ...options) {
  return comp.sort((a, b) => {
    for (let option of options) {
      let aValue, bValue;

      if (Array.isArray(option)) {
        const [field, ...order] = option;
        aValue = order.indexOf(getData(a, field));
        bValue = order.indexOf(getData(b, field));
        if (aValue === -1) aValue = Infinity; // put items not in the order list at the end
        if (bValue === -1) bValue = Infinity;
      } else {
        [aValue, bValue] = [getData(a, option), getData(b, option)];
        if (option === 'parse') [aValue, bValue] = [bValue, aValue];
        else if (option === 'role') [aValue, bValue] = [ROLES.indexOf(aValue), ROLES.indexOf(bValue)];
      }

      if (aValue !== bValue) return aValue < bValue ? -1 : 1;
    }
    return 0;
  });
}

function filterBy(comp, toggle = true, type, value, ...values) {
  return comp.filter(nick => toggle ? value === getData(nick, type) || values.includes(getData(nick, type)) : value !== getData(nick, type) && !values.includes(getData(nick, type)));
}

function setOutput(comp, range, sheet = TIER) {
  const sr = SHEET.getSheetByName(sheet).getRange(range);
  const cLength = comp.length;
  const srLength = sr.getValues().length;

  // Clear content and set values
  const newArray = cLength >= srLength 
    ? comp.slice(0, srLength) 
    : comp.concat(Array(srLength - cLength).fill(['']));
  
  sr.clearContent();
  sr.setValues(createArray(newArray));
}

function getDarkIntent(boss = 0) {
  const COMP = COMPS[boss];
  // Get all warlocks sorted by parse
  const warlocks = orderBy(getByType(COMP, 'class', 'Warlock'), 'parse');

  // Get all Shadow and Balance characters sorted by parse
  const shadowBalanceDPS = orderBy(getByType(COMP, 'spec', 'Shadow', 'Balance'), 'parse')
    .filter(dps => !warlocks.includes(dps));

  // Get all ranged DPS sorted by parse, excluding warlocks and Shadow/Balance characters
  const otherRangedDPS = orderBy(getByType(COMP, 'role', 'Ranged'), 'parse')
    .filter(dps => !warlocks.includes(dps) && !shadowBalanceDPS.includes(dps));

  // Combine Shadow/Balance characters and other ranged DPS into one array
  const rangedDPS = [...shadowBalanceDPS, ...otherRangedDPS];

  // Assign the highest parse warlock to the highest parse ranged DPS
  const assignments = [];
  while (warlocks.length && rangedDPS.length) {
    const warlock = warlocks.shift();
    const dps = rangedDPS.shift();
    assignments.push({ warlock, dps });
  }

  return assignments;
}

function getWarlockAssignments() {
  const warlocks = getAllByType('class','Warlock');
  const assignments = warlocks.map(warlock => [warlock, '', '']);

  for (let i = 0; i < BOSSES.length; i++) {
    const bossAssignments = getDarkIntent(i);
    for (let j = 0; j < warlocks.length; j++) {
      const assignment = bossAssignments.find(assignment => assignment.warlock === warlocks[j]);
      assignments[j].push(assignment ? assignment.dps : null);
      if (i < BOSSES.length - 1) {
        assignments[j].push('');
      }
    }
  }

  return assignments;
}

function getBloodlustAssignments(boss = 0) {
  const casters = getByType(COMPS[boss], 'class', 'Shaman', 'Mage');
  const result = orderBy(casters, 'parse').reverse();
  return result[0];
}

function getTankCDs(comp, nick, excludeOtherTank = false, excludeList = []) {
  const tanks = getByType(comp, 'role', 'Tank');
  const otherTank = tanks.find(tank => tank !== nick);
  const targetCD = getCooldown(comp, 'target', ['dmgreduc'])
    .filter(cd => !excludeList.includes(cd))
    .filter(cd => !excludeOtherTank || cd !== otherTank)
    .filter(cd => cd !== nick);
  const tankCDList = [nick, nick, ...targetCD]
    .filter(cd => cd !== null && cd !== undefined);

  return tankCDList;
}

function getRaidCDs(comp, type = ['aura', 'dmgreduc', 'heal'], excludeList = []) {
  const raidCD = getCooldown(comp, 'raid', type)
    .filter(cd => !excludeList.includes(cd))
    .filter(cd => cd !== null && cd !== undefined);

  return raidCD;
}

function createArray(comp) {
  return comp.map(nick => [nick]);
}

function getTanks(comp) {
  const primaryTanks = getByType(comp, 'role', 'Tank');
  const extraTank = OSTANKS.find(tank => comp.includes(tank));
  const tanks = [...primaryTanks, extraTank];

  return tanks;
}

/*
  let newArray = [];
  for (nick in comp) {
    newArray.push([comp[nick]])
  }

  return newArray;
*/