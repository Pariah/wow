function test() {
  let testvar = orderBy(getCooldown(0,'personal','dmgreduc','all'));
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

function getByType(boss = 0, type, value, ...values) {
  return COMPS[boss].filter(nick => value === getData(nick, type) || values.includes(getData(nick, type)));
}

function getCooldown(boss = 0, type, subtype, ...subtypes) {
  const cooldowns = subtypes.length === 0 ? COOLDOWN[type][subtype] : COOLDOWN[type][subtype][subtypes];
  return COMPS[boss].filter(nick => cooldowns.includes(getData(nick, 'specid')));
}

function getAbility(boss = 0, ability, ...abilities) {
  const abilityList = abilities.length === 0 ? ABILITY[ability] : ABILITY[ability][abilities];
  return COMPS[boss].filter(nick => abilityList.includes(getData(nick, 'specid')));
}

function orderBy(comp, ...options) {
  return comp.sort((a, b) => {
    for (let option of options) {
      let aValue = getData(a, option);
      let bValue = getData(b, option);

      if (option === 'parse') [aValue, bValue] = [bValue, aValue];

      if (option === 'role') {
        aValue = ROLES.indexOf(aValue);
        bValue = ROLES.indexOf(bValue);
      }

      if (aValue !== bValue) return aValue < bValue ? -1 : 1;
    }
    return 0;
  });
}

function filterBy(comp, toggle = true ,type, value, ...values) {
  return comp.filter(nick => toggle ? value === getData(nick, type) || values.includes(getData(nick, type)) : value !== getData(nick, type) && !values.includes(getData(nick, type)));
}

function setOutput(comp, range, sheet = SHEET_TIER) {
  const sr = SHEET.getSheetByName(sheet).getRange(range);
  const cLength = comp.length;
  const srLength = sr.getValues().length;

  // Clear content and set values
  const newArray = cLength >= srLength 
    ? comp.slice(0, srLength) 
    : comp.concat(Array(srLength - cLength).fill(['']));
  
  sr.clearContent();
  sr.setValues(newArray);
}
function getDarkIntent(boss = 0) {
  // Get all warlocks sorted by parse
  const warlocks = orderBy(getByType(boss, 'class', 'Warlock'), 'parse');

  // Get all Shadow and Balance characters sorted by parse
  const shadowBalanceDPS = orderBy(getByType(boss, 'spec', 'Shadow', 'Balance'), 'parse')
    .filter(dps => !warlocks.includes(dps));

  // Get all ranged DPS sorted by parse, excluding warlocks and Shadow/Balance characters
  const otherRangedDPS = orderBy(getByType(boss, 'role', 'Ranged'), 'parse')
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
// Assignments
/*
    Roles -- Tanks > OS Tanks > Healers > OS Healers 
    Boss Names Vertically
    Boss Names Horizontally
    Boss Names Shortened. Ignore symbols & spaces
*/

/*
  let newArray = [];
  for (nick in comp) {
    newArray.push([comp[nick]])
  }

  return newArray;
*/