function forEachRaid() {
    // Assignments
    assignmentsRoles();
    assignmentsDarkIntent();
    assignmentsBloodlust();
    // Bosses
    bossMagmaw();
}

function forEachTier() {
    setBossNames();
}

function assignmentsRoles() {
    const range = 'X6:X17';
    const allTanksHealers = getAllByType('role','Tank','Healer')
    const combinedArray = [...new Set([...allTanksHealers, ...OSTANKS, ...OSHEALERS])];
    const output = orderBy(combinedArray, false, 0, 0, 'role','class')
    setOutput(output, range);
}

function assignmentsDarkIntent() {
    const assignments = getWarlockAssignments();
    SHEET_TIER.getRange('T20').offset(0, 0, assignments.length, assignments[0].length).setValues(assignments);
}

function assignmentsBloodlust() {
    const assignments = BOSSES.map((boss,i) => getBloodlustAssignments(i));
    const range = 'AQ5:AQ17';
    setOutput(assignments, range);
}

function setBossNames() {
    const compCells = ['B4', 'H4', 'N4', 'B10', 'H10', 'N10', 'B16', 'H16', 'N16', 'B22', 'H22', 'N22', 'B28', 'H28', 'N28'];
    const assignRolesRange = 'AA4:AM4';
    const assignDarkIntentCells = ['W19', 'Y19', 'AA19', 'AC19', 'AE19', 'AG19', 'AI19', 'AK19', 'AM19','AO19', 'AQ19', 'AS19', 'AU19'];
    const assignBloodlustRange = 'AO5:AO17';
    const bossCells = [];
    const bossNamesShort = BOSSES.map(boss => boss.substring(0, 3).replace(/[^a-zA-Z]/g, ''));

    compCells.forEach((cell, index) => SHEET_TIER.getRange(cell).setValue(BOSSES[index]));
    SHEET_TIER.getRange(assignRolesRange).setValues([bossNamesShort]);
    const bloodlustValues = bossNamesShort.map(name => [name]);
    SHEET_TIER.getRange(assignBloodlustRange).setValues(bloodlustValues);
    assignDarkIntentCells.forEach((cell, index) => SHEET_TIER.getRange(cell).setValue(bossNamesShort[index]));
}

function bossMagmaw() {
    const BOSS = 0;
    const RANGE_LAVAPARASITES = 'AZ5';
    const RANGE_HOOK = 'BA8:BA10';
    const RANGE_LAVASPEW = 'BA13:BA18';
    const RANGE_MANGLE = 'BA21:BA26';

    const lavaParasitesNicks = getByType(BOSS, 'specid', 251, 252);
    setOutput(lavaParasitesNicks, RANGE_LAVAPARASITES);

    let hookNicks = getByType(BOSS, 'role', 'Melee');
    hookNicks = orderBy(hookNicks, false, 0, 0, 'parse').reverse();
    setOutput(hookNicks, RANGE_HOOK);

    let lavaSpewNicks = getCooldown(BOSS, 'raid', ['aura', 'dmgreduc', 'heal']);
    lavaSpewNicks = orderBy(lavaSpewNicks, false, 0, 0, 'role', 'class');
    setOutput(lavaSpewNicks, RANGE_LAVASPEW);

    // Fix so that the second tank's personal cooldown is not included in the first 3 rows
    // Only show personals of the tank1 in first 3, tank2 is second 3
    let mangleNicks = [...getCooldown(BOSS, 'personal', ['dmgreduc'], 'all'), ...getCooldown(BOSS, 'target', ['dmgreduc'])];
    setOutput(mangleNicks, RANGE_MANGLE);
}

function bossOmnotron() {
    const BOSS = 1;
    const RANGE_ARCANEANNIHILATORPURGE  = 'BG5';
    const RANGE_ARCANEANNIHILATOR = 'BH6:BH11';
    const RANGE_POISONPROTOCOL = 'BG14:BG15';
    const RANGE_CHEMICALCLOUD = 'BH18:BH20';
    const RANGE_SHADOWCONDUCTOR = 'BH23:BH24';
    const RANGE_COOLDOWNS = 'BH27:BH32';

    let arcaneAnnihilatorPurgeNicks = getAbility(BOSS, 'purge', 'magic');
    arcaneAnnihilatoPurgeNicks = orderBy(arcaneAnnihilatorPurgeNicks, false, 0, 0, 'class', 'parse');
    setOutput(arcaneAnnihilatorPurgeNicks, RANGE_ARCANEANNIHILATORPURGE);

    let arcaneAnnihilatorNicks = getAbility(BOSS, 'interrupt');
    arcaneAnnihilatorNicks = filterBy(arcaneAnnihilatorNicks, false, 'role', 'Healer', 'Tank');
    arcaneAnnihilatorNicks = orderBy(arcaneAnnihilatorNicks, false, 0, 0, 'role', 'class');
    setOutput(arcaneAnnihilatorNicks, RANGE_ARCANEANNIHILATOR);

    const poisonProtocolNicks = getByType(BOSS, 'class', 'Hunter');
    setOutput(poisonProtocolNicks, RANGE_POISONPROTOCOL);

    const chemicalCloudNicks = getByType(BOSS, 'class', 'Druid');
    setOutput(chemicalCloudNicks, RANGE_CHEMICALCLOUD);

    let shadowConductorNicks = getByType(BOSS, 'class', 'Priest');
    shadowConductorNicks = orderBy(shadowConductorNicks, false, 0, 0, 'role');
    setOutput(shadowConductorNicks, RANGE_SHADOWCONDUCTOR);

    const cooldownNicks = getCooldown(BOSS, 'raid', ['aura', 'dmgreduc', 'heal']);
    setOutput(cooldownNicks, RANGE_COOLDOWNS);
}

function bossChimaeron() {
    const BOSS = 2;
    const RANGE_TANKS = 'BP5:BP7';
    const RANGE_DOUBLEATTACKTANKCDS = 'BO11:BO13';
    const RANGE_STACKTANKCDS = 'BO17:BO19';
    const RANGE_STACKRAIDCDS = 'BV5:BV10';
    const RANGE_TANKSMELEE = 'BV14:BV23';
    const RANGE_HEALERSRANGED = 'CC6:CC23';

    const retPaladins = getByType(BOSS, 'specid', 70);
    const otherTank = retPaladins ? orderBy(retPaladins, false, 0, 0, 'parse') : OSTANKS.find(tank => COMPS[BOSS].includes(tank));
    let tanks = [...getByType(BOSS, 'role', 'Tank'), ...otherTank];
    tanks = orderBy(tanks, false, 0, 0, 'spec', 'Blood', 'Protection','Guardian','Retribution');
    setOutput(tanks, RANGE_TANKS);

    function getTankCDS(tankIndex, excludeTanks) {
        return [
            ...getCooldown(BOSS, 'personal', ['dmgreduc'], 'all').filter(nick => nick === tanks[tankIndex]),
            ...getCooldown(BOSS, 'personal', ['health']).filter(nick => nick === tanks[tankIndex]),
            ...getCooldown(BOSS, 'target', ['dmgreduc']).filter(nick => !excludeTanks.includes(nick))
        ].filter(entry => entry !== null && entry !== undefined);
    }
    
    // DOUBLE ATTACK = tanks[0]
    const doubleAttackTankCDS = getTankCDS(0, [tanks[1], tanks[2]]);
    setOutput(doubleAttackTankCDS, RANGE_DOUBLEATTACKTANKCDS);
    
    // STACK TANK = tanks[1]
    let stackTankCDS = getTankCDS(1, [tanks[0], tanks[2]]);
    stackTankCDS = stackTankCDS.filter(entry => !doubleAttackTankCDS.slice(0, 3).includes(entry));
    setOutput(stackTankCDS, RANGE_STACKTANKCDS);

    let stackTank
}

// TODO Make a function that takes in a boss and returns tank CDs depending on which tank
// TODO Make a function that takes in a boss and returns raid CDs