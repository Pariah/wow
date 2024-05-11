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

function getByType(boss = 0, type, value, ...values) {
  return COMPS[boss].filter(nick => value === getData(nick, type) || values.includes(getData(nick, type)));
}

function getAllByType(type, value, ...values) {
  const allNicks = ROSTER.map(row => row.nick);
  return allNicks.filter(nick => value === getData(nick, type) || values.includes(getData(nick, type)));
}

function getCooldown(boss = 0, type, subtype = [], ...subtypes) {
  let cooldowns;
  if (subtype.length === 1) {
    cooldowns = subtypes.length === 0 ? COOLDOWN[type][subtype[0]] : subtypes.reduce((acc, curr) => [...acc, ...COOLDOWN[type][subtype[0]][curr]], []);
  } else {
    cooldowns = subtype.reduce((acc, curr) => [...acc, ...COOLDOWN[type][curr]], []);
  }
  return COMPS[boss].filter(nick => cooldowns.includes(getData(nick, 'specid')));
}

function getAbility(boss = 0, ability, ...abilities) {
  const abilityList = abilities.length === 0 ? ABILITY[ability] : ABILITY[ability][abilities];
  return COMPS[boss].filter(nick => abilityList.includes(getData(nick, 'specid')));
}

function orderBy(comp, offspec = false, numOSTanks = 0, numOSHealers = 0, ...options) {
  const osTanksInComp = offspec ? comp.filter(player => OSTANKS.includes(player)).slice(0, numOSTanks) : [];
  const osHealersInComp = offspec ? comp.filter(player => OSHEALERS.includes(player)).slice(0, numOSHealers) : [];
  
  return comp.sort((a, b) => {
    for (let option of options) {
      let [aValue, bValue] = [getData(a, option), getData(b, option)];

      if (option === 'parse') [aValue, bValue] = [bValue, aValue];
      else if (option === 'role') {
        if (osTanksInComp.includes(a)) aValue = 'OSTank';
        if (osHealersInComp.includes(a)) aValue = 'OSHealer';
        if (osTanksInComp.includes(b)) bValue = 'OSTank';
        if (osHealersInComp.includes(b)) bValue = 'OSHealer';
        [aValue, bValue] = [ROLES.indexOf(aValue), ROLES.indexOf(bValue)];
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
  // Get all warlocks sorted by parse
  const warlocks = orderBy(getByType(boss, 'class', 'Warlock'), false, 0, 0, 'parse');

  // Get all Shadow and Balance characters sorted by parse
  const shadowBalanceDPS = orderBy(getByType(boss, 'spec', 'Shadow', 'Balance'), false, 0, 0, 'parse')
    .filter(dps => !warlocks.includes(dps));

  // Get all ranged DPS sorted by parse, excluding warlocks and Shadow/Balance characters
  const otherRangedDPS = orderBy(getByType(boss, 'role', 'Ranged'), false, 0, 0, 'parse')
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
  const casters = getByType(boss, 'class', 'Shaman', 'Mage');
  const result = orderBy(casters, false, 0, 0, 'parse').reverse();
  return result[0];
}

function getBossNames(num = 3) {
  return BOSSES.map(name => name.slice(0, num).replace(/[^a-zA-Z]/g, ''));
}

function createArray(comp) {
  return comp.map(nick => [nick]);
}

// Assignments
/*
    Roles -- Tanks > OS Tanks > Healers > OS Healers 
    Boss Names Vertically
    Boss Names Horizontally
*/
// Check sortBy, maybe put offspec, numOStanks and numOshealers in {} in the function call


/*
  let newArray = [];
  for (nick in comp) {
    newArray.push([comp[nick]])
  }

  return newArray;
*/