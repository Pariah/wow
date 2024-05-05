

function test() {
  let testvar = setSortedNicks(getRolesFromComp(0,"Ranged"));
  //console.log(testvar);
  setOutput(testvar, "A1:A15");
}

function getDataBySpecID(specid, key) {
    const data = SPECID[specid];
    return data ? data[key] : 'Unknown';
}

function getData(nick, key) {
    const data = ROSTER.find(row => row.nick === nick);
    return data ? data[key] || getDataBySpecID(data.specid, key) : 'Unknown';
}

function getRolesFromComp(boss, role, ...roles) {
    return COMPS[boss].filter(nick => role === getData(nick, 'role') || roles.includes(getData(nick, 'role')));
}

function getSpecsFromComp(boss, spec, ...specs) {
    return COMPS[boss].filter(nick => spec === getData(nick, 'spec') || specs.includes(getData(nick, 'spec')));
}

function setSortedNicks(comp, customOrder = ROLES) {
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
