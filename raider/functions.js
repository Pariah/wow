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

function getClass(boss = 0, class_, ...classes_) {
  return COMPS[boss].filter(nick => class_ === getData(nick, 'class') || classes_.includes(getData(nick, 'class')));   
}

function getSpec(boss = 0, spec, ...specs){ 
  return COMPS[boss].filter(nick => spec === getData(nick, 'spec') || specs.includes(getData(nick, 'spec')));
}

function getRole(boss = 0, role, ...roles) {
    return COMPS[boss].filter(nick => role === getData(nick, 'role') || roles.includes(getData(nick, 'role')));
}

function getCooldown(boss = 0, type, subtype, ...subtypes) {
  let cooldowns = [];
  subtypes.length === 0 ? cooldowns = COOLDOWN[type][subtype] : cooldowns = COOLDOWN[type][subtype][subtypes];
  return COMPS[boss].filter(nick => cooldowns.includes(getData(nick, 'specid')));
}

function orderBy(comp, customOrder = ROLES) {
  const roleIndices = new Map();
  const dataMap = new Map();

  // Pre-compute role indices and dataMap for faster sorting
  for (const nick of comp) {
    const role = getData(nick, 'role');
    const roleIndex = customOrder.indexOf(role);
    const class_ = getData(nick, 'class');
    dataMap.set(nick, { roleIndex, class_ });
    roleIndices.set(nick, roleIndex);
  }

  comp.sort((a, b) => {
    const aData = dataMap.get(a);
    const bData = dataMap.get(b);

    // Sort by role indices
    const roleDiff = aData.roleIndex - bData.roleIndex;
    if (roleDiff !== 0) return roleDiff;

    // If roles are the same, sort by class
    return aData.class_.localeCompare(bData.class_);
  });

  let newArray = [];
  for (nick in comp) {
    newArray.push([comp[nick]])
  }

  return newArray;
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

// Assignments
/*
    Roles -- Tanks > OS Tanks > Healers > OS Healers 
    Boss Names Vertically
    Boss Names Horizontally
    Boss Names Shortened. Ignore symbols & spaces
*/



/*
    Dark Intent
    Generate top recipients list. Boomkins + Spriests > Others. Sort by average performance.
    Assign best warlock to best recipient > 2nd best warlock to 2nd best recipient.
    For guild sheet, check who is in each fight.
*/

// Global
// getCooldown(boss = 0, type) --Type = Personal, Raid, or Target
// getPurge(boss = 0, role, ...roles)
// getKick(boss = 0, role, ...roles)

// Magmaw
// Hook -- Pick 3 melee. Sort by class -> name.

//