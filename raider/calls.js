function forEachRaid() {
    // Assignments
    assignmentsRoles();
    assignmentsDarkIntent();
    assignmentsBloodlust();
    // Bosses
    bossMagmaw();
    bossOmnotron();
    bossChimaeron();
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

    const hookNicks = orderBy(getByType(BOSS, 'role', 'Melee'), false, 0, 0, 'parse').reverse();
    setOutput(hookNicks, RANGE_HOOK);

    const lavaSpewNicks = orderBy(getRaidCDs(BOSS), false, 0, 0, 'role', 'class');
    setOutput(lavaSpewNicks, RANGE_LAVASPEW);

    const firstTankCDs = getTankCDs(BOSS, getTanks(BOSS)[0], true).slice(0, 3);
    const mangleNicks = [
        ...firstTankCDs,
        ...getTankCDs(BOSS, getTanks(BOSS)[1], true, firstTankCDs).slice(0, 3)
    ];
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
    arcaneAnnihilatorPurgeNicks = orderBy(arcaneAnnihilatorPurgeNicks, false, 0, 0, 'class', 'parse');
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

    // DOUBLE ATTACK = tanks[0]
    const doubleAttackTankCDs = getTankCDs(BOSS, tanks[0], true, [tanks[1], tanks[2]]);
    setOutput(doubleAttackTankCDs, RANGE_DOUBLEATTACKTANKCDS);
    
    // STACK TANK = tanks[1]
    const excludeList = doubleAttackTankCDs.slice(0, 3);
    const stackTankCDs = getTankCDs(BOSS, tanks[1], true, [tanks[0], tanks[2], ...excludeList]);
    setOutput(stackTankCDs, RANGE_STACKTANKCDS);

    const stackRaidCDs = getRaidCDs(BOSS, ['aura', 'dmgreduc', 'heal']);
    setOutput(stackRaidCDs, RANGE_STACKRAIDCDS);

    const tanksMeleeSorted = orderBy(getByType(BOSS, 'role', 'Tank', 'Melee'), false, 0, 0, 'role', 'class');
    setOutput(tanksMeleeSorted, RANGE_TANKSMELEE);

    const healersRanged = orderBy(getByType(BOSS, 'role', 'Healer', 'Ranged'), false, 0, 0, 'role', 'class');
    setOutput(healersRanged, RANGE_HEALERSRANGED);
}

function bossAtramedes() {
    const BOSS = 3;
    const RANGE_GONGERS = 'CK5:CK7';
    const RANGE_SONICBREATH = 'CJ10:CJ11';
    const RANGE_OBNOXIOUSFIENDS = 'CJ14:CJ16';
    const RANGE_SEARINGFLAME = 'CJ20:CJ23';
    const RANGE_TRASH_LEFT = 'CR5:CR8';
    const RANGE_TRASH_RIGHT = 'CR11:CR14';

    const topHunter = orderBy(getByType(BOSS, 'class', 'Hunter'), false, 0, 0, 'parse')[0];
    const topMage = orderBy(getByType(BOSS, 'class', 'Mage'), false, 0, 0, 'parse')[0];
    const gongers = [topHunter, topHunter, topMage];
    setOutput(gongers, RANGE_GONGERS);

    const sonicBreath = getByType(BOSS, 'class', 'Druid');
    setOutput(sonicBreath, RANGE_SONICBREATH);

    let obnoxiousFiends = getAbility(BOSS, 'interrupt');
    obnoxiousFiends = filterBy(obnoxiousFiends, false, 'role', 'Healer', 'Tank');
    obnoxiousFiends = orderBy(obnoxiousFiends, false, 0, 0, 'role', 'class');
    setOutput(obnoxiousFiends, RANGE_OBNOXIOUSFIENDS);

    const searingFlame = getRaidCDs(BOSS);
    setOutput(searingFlame, RANGE_SEARINGFLAME);

    const tanks = getTanks(BOSS).slice(0, 2);
    const trash = [...tanks, ...tanks];
    setOutput(trash, RANGE_TRASH_LEFT);
    setOutput(trash, RANGE_TRASH_RIGHT);
}

function bossMaloriak() {
    const BOSS = 4;
    const RANGE_TANKS = 'CY5:CY7';
    const RANGE_ARCANESTORM = 'CX11:CX13';
    const RANGE_RELEASEABERRATIONS = 'CX17:CX18';
    const RANGE_REMEDY = 'CX22:CX23';
    const RANGE_FROSTRAP = 'DF5:DF6';
    const RANGE_ENFULGINGDARKNESS = 'DD9:DD10';
    const RANGE_SCORCHINGBLAST = 'DE13:DE15';
    const RANGE_GREENPHASE = 'DE18:DE20';
    const RANGE_HEALERSRANGED = 'DL6:DL23';

    const tanks = orderBy(getTanks(BOSS), false, 0, 0, 'spec', 'Blood', 'Protection','Guardian');
    setOutput(tanks, RANGE_TANKS);

    const interrupters = orderBy(getAbility(BOSS, 'interrupt'), false, 0, 0, 'parse');
    const releaseAberrations = interrupters;
}