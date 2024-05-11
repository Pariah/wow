const CLEAR_RANGES = [
    // BossMagmaw
    'AZ5',
    'BA8:BA10',
    'BA13:BA18',
    'BA21:BA26',
    // BossOmnotron
    'BG5',
    'BH6:BH11',
    'BG14:BG15',
    'BH18:BH20',
    'BH23:BH24',
    'BH27:BH32',
    // BossChimaeron
    'BP5:BP7',
    'BO11:BO13',
    'BO17:BO19',
    'BV5:BV10',
    'BV14:BV23',
    'CC6:CC23',
    // BossAtramedes
    'CK5:CK7',
    'CJ10:CJ11',
    'CJ14:CJ16',
    'CJ20:CJ23',
    'CR5:CR8',
    'CR11:CR14',
    // BossMaloriak
    'CY5:CY7',
    'CX11:CX13',
    'CX17:CX18',
    'CX22:CX23',
    'DF5:DF6',
    'DD9:DD10',
    'DE13:DE15',
    'DE18:DE20',
    'DL6:DL23'
];

function forEachRaid() {
    // Assignments
    assignmentsRoles();
    assignmentsDarkIntent();
    assignmentsBloodlust();

    // Bosses
    // BWD
    bossMagmaw();
    bossOmnotron();
    bossChimaeron();
    bossAtramedes();
    bossMaloriak();
    bossNefarian();

    // BOT
    bossHalfus();
    bossValionaAndTheralion();
    bossAscendantCouncil();
    bossChoGall();
    bossSinestra();

    // TOTFW
    bossConclaveOfWind();
    bossAlAkir();

    // TODO Get and updated parses here instead of on sheet formulas
}

function forEachTier() {
    setBossNames();
}

function assignmentsRoles() {
    const range = 'X6:X17';
    const allTanksHealers = getAllByType('role','Tank','Healer')
    const combinedArray = [...new Set([...allTanksHealers, ...OSTANKS, ...OSHEALERS])];
    const output = orderBy(combinedArray, 'role','class')
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
    const COMP = COMPS[BOSS];
    const RANGE_LAVAPARASITES = 'AZ5';
    const RANGE_HOOK = 'BA8:BA10';
    const RANGE_LAVASPEW = 'BA13:BA18';
    const RANGE_MANGLE = 'BA21:BA26';

    const lavaParasitesNicks = getByType(COMP, 'specid', 251, 252);
    setOutput(lavaParasitesNicks, RANGE_LAVAPARASITES);

    const hookNicks = orderBy(getByType(COMP, 'role', 'Melee'), 'parse').reverse();
    setOutput(hookNicks, RANGE_HOOK);

    const lavaSpewNicks = orderBy(getRaidCDs(COMP), 'role', 'class');
    setOutput(lavaSpewNicks, RANGE_LAVASPEW);

    const firstTankCDs = getTankCDs(COMP, getTanks(COMP)[0], true).slice(0, 3);
    const mangleNicks = [
        ...firstTankCDs,
        ...getTankCDs(COMP, getTanks(COMP)[1], true, firstTankCDs).slice(0, 3)
    ];
    setOutput(mangleNicks, RANGE_MANGLE);
}

function bossOmnotron() {
    const BOSS = 1;
    const COMP = COMPS[BOSS];
    const RANGE_ARCANEANNIHILATORPURGE  = 'BG5';
    const RANGE_ARCANEANNIHILATOR = 'BH6:BH11';
    const RANGE_POISONPROTOCOL = 'BG14:BG15';
    const RANGE_CHEMICALCLOUD = 'BH18:BH20';
    const RANGE_SHADOWCONDUCTOR = 'BH23:BH24';
    const RANGE_COOLDOWNS = 'BH27:BH32';

    let arcaneAnnihilatorPurgeNicks = getAbility(COMP, 'purge', 'magic');
    arcaneAnnihilatorPurgeNicks = orderBy(arcaneAnnihilatorPurgeNicks, 'class', 'parse');
    setOutput(arcaneAnnihilatorPurgeNicks, RANGE_ARCANEANNIHILATORPURGE);

    let arcaneAnnihilatorNicks = getAbility(COMP, 'interrupt');
    arcaneAnnihilatorNicks = filterBy(arcaneAnnihilatorNicks, false, 'role', 'Healer', 'Tank');
    arcaneAnnihilatorNicks = orderBy(arcaneAnnihilatorNicks, 'role', 'class');
    setOutput(arcaneAnnihilatorNicks, RANGE_ARCANEANNIHILATOR);

    const poisonProtocolNicks = getByType(COMP, 'class', 'Hunter');
    setOutput(poisonProtocolNicks, RANGE_POISONPROTOCOL);

    const chemicalCloudNicks = getByType(COMP, 'class', 'Druid');
    setOutput(chemicalCloudNicks, RANGE_CHEMICALCLOUD);

    let shadowConductorNicks = getByType(COMP, 'class', 'Priest');
    shadowConductorNicks = orderBy(shadowConductorNicks, 'role');
    setOutput(shadowConductorNicks, RANGE_SHADOWCONDUCTOR);

    const cooldownNicks = getCooldown(COMP, 'raid', ['aura', 'dmgreduc', 'heal']);
    setOutput(cooldownNicks, RANGE_COOLDOWNS);
}

function bossChimaeron() {
    const BOSS = 2;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'BP5:BP7';
    const RANGE_DOUBLEATTACKTANKCDS = 'BO11:BO13';
    const RANGE_STACKTANKCDS = 'BO17:BO19';
    const RANGE_STACKRAIDCDS = 'BV5:BV10';
    const RANGE_TANKSMELEE = 'BV14:BV23';
    const RANGE_HEALERSRANGED = 'CC6:CC23';

    const retPaladins = getByType(COMP, 'specid', 70);
    const otherTank = retPaladins ? orderBy(retPaladins, 'parse') : OSTANKS.find(tank => COMP.includes(tank));
    let tanks = [...getByType(COMP, 'role', 'Tank'), ...otherTank];
    tanks = orderBy(tanks, ['spec', 'Blood', 'Protection','Guardian','Retribution']);
    setOutput(tanks, RANGE_TANKS);

    // DOUBLE ATTACK = tanks[0]
    const doubleAttackTankCDs = getTankCDs(COMP, tanks[0], true, [tanks[1], tanks[2]]);
    setOutput(doubleAttackTankCDs, RANGE_DOUBLEATTACKTANKCDS);
    
    // STACK TANK = tanks[1]
    const excludeList = doubleAttackTankCDs.slice(0, 3);
    const stackTankCDs = getTankCDs(COMP, tanks[1], true, [tanks[0], tanks[2], ...excludeList]);
    setOutput(stackTankCDs, RANGE_STACKTANKCDS);

    const stackRaidCDs = getRaidCDs(COMP);
    setOutput(stackRaidCDs, RANGE_STACKRAIDCDS);

    const tanksMeleeSorted = orderBy(getByType(COMP, 'role', 'Tank', 'Melee'), 'role', 'class');
    setOutput(tanksMeleeSorted, RANGE_TANKSMELEE);

    const healersRanged = orderBy(getByType(COMP, 'role', 'Healer', 'Ranged'), 'role', 'class');
    setOutput(healersRanged, RANGE_HEALERSRANGED);
}

function bossAtramedes() {
    const BOSS = 3;
    const COMP = COMPS[BOSS];
    const RANGE_GONGERS = 'CK5:CK7';
    const RANGE_SONICBREATH = 'CJ10:CJ11';
    const RANGE_OBNOXIOUSFIENDS = 'CJ14:CJ16';
    const RANGE_SEARINGFLAME = 'CJ20:CJ23';
    const RANGE_TRASH_LEFT = 'CR5:CR8';
    const RANGE_TRASH_RIGHT = 'CR11:CR14';

    const topHunter = orderBy(getByType(COMP, 'class', 'Hunter'), 'parse')[0];
    const topMage = orderBy(getByType(COMP, 'class', 'Mage'), 'parse')[0];
    const gongers = [topHunter, topHunter, topMage];
    setOutput(gongers, RANGE_GONGERS);

    const sonicBreath = getByType(COMP, 'class', 'Druid');
    setOutput(sonicBreath, RANGE_SONICBREATH);

    let obnoxiousFiends = getAbility(COMP, 'interrupt');
    obnoxiousFiends = filterBy(obnoxiousFiends, false, 'role', 'Healer', 'Tank');
    obnoxiousFiends = orderBy(obnoxiousFiends, 'role', 'class');
    setOutput(obnoxiousFiends, RANGE_OBNOXIOUSFIENDS);

    const searingFlame = getRaidCDs(COMP);
    setOutput(searingFlame, RANGE_SEARINGFLAME);

    const tanks = getTanks(COMP).slice(0, 2);
    const trash = [...tanks, ...tanks];
    setOutput(trash, RANGE_TRASH_LEFT);
    setOutput(trash, RANGE_TRASH_RIGHT);
}

function bossMaloriak() {
    const BOSS = 4;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'CY5:CY7';
    const RANGE_ARCANESTORM = 'CX11:CX13';
    const RANGE_RELEASEABERRATIONS = 'CX17:CX18';
    const RANGE_REMEDY = 'CX22:CX23';
    const RANGE_FROSTRAP = 'DF5:DF6';
    const RANGE_ENFULFINGDARKNESS = 'DD9:DD10';
    const RANGE_SCORCHINGBLAST = 'DE13:DE15';
    const RANGE_GREENPHASE = 'DE18:DE20';
    const RANGE_HEALERSRANGED = 'DL6:DL23';

    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const interrupters = orderBy(getAbility(COMP, 'interrupt'), 'parse');
    const meleeInterrupts = getByType(interrupters, 'role', 'Melee');
    const rangedInterrupts = getByType(interrupters, 'role', 'Ranged');
    const releaseAberrations = meleeInterrupts.slice(0, 2);
    const arcaneStorm = [...meleeInterrupts.slice(2, 4), rangedInterrupts[0]];

    setOutput(arcaneStorm, RANGE_ARCANESTORM);
    setOutput(releaseAberrations, RANGE_RELEASEABERRATIONS);

    const purgers = getAbility(COMP, 'purge', 'magic');
    const remedy = orderBy(orderBy(purgers, 'parse'), ['specid', 63, 62, 64, 256, 257, 258, 262, 264, 263]);
    setOutput(remedy, RANGE_REMEDY);

    const frostTrap = getByType(COMP, 'class', 'Hunter');
    setOutput(frostTrap, RANGE_FROSTRAP);

    const engulfingDarkness = getRaidCDs(COMP);
    setOutput(engulfingDarkness, RANGE_ENFULFINGDARKNESS);

    const scorcingBlast = getRaidCDs(COMP, undefined, engulfingDarkness.slice(0, 2));
    setOutput(scorcingBlast, RANGE_SCORCHINGBLAST);

    const greenPhase = getTankCDs(COMP, getTanks(COMP)[0], true);
    setOutput(greenPhase, RANGE_GREENPHASE);

    const healersRanged = orderBy(getByType(COMP, 'role', 'Healer', 'Ranged'), 'role', 'class');
    setOutput(healersRanged, RANGE_HEALERSRANGED);
}

function bossNefarian() {
    const BOSS = 5;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'DT5:DT7';
    const RANGE_FROSTTRAP = 'DT10:DT11';
    const RANGE_KNOCKBACK = 'DR14';
    const RANGE_HEALERASSIGNS = 'DT17:DT23';
    const RANGE_ELECTROCUTE = 'DZ5:DZ11';
    const RANGE_INTERRUPTS = 'EA18:EA23';
    const RANGE_PLATFORM = 'EG5:EG23';

    // Figure out who the real third tank should be
    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const frostTrap = getByType(COMP, 'class', 'Hunter');
    setOutput(frostTrap, RANGE_FROSTTRAP);

    const knockback = getByType(COMP, 'class', 'Druid');
    setOutput(knockback, RANGE_KNOCKBACK);

    const realHealers = getByType(COMP, 'role', 'Healer');
    const osHealers = COMP.filter(player => OSHEALERS.includes(player));
    let healers = [...realHealers, ...osHealers];
    healers = orderBy(healers, ['class', 'Paladin', 'Shaman', 'Priest', 'Druid']);
    let [element1, element2, element3, element4, ...rest] = healers;
    healers = [element1, element4, element2, element3, ...rest];
    setOutput(healers, RANGE_HEALERASSIGNS);

    const electrocute = getRaidCDs(COMP);
    setOutput(electrocute, RANGE_ELECTROCUTE);

    const interrupts = filterBy(orderBy(getAbility(COMP, 'interrupt'),'role'), false, 'role', 'Healer', 'Tank');
    interrupts.splice(0, 0, tanks[0]);
    interrupts.splice(2, 0, tanks[1]);
    setOutput(interrupts, RANGE_INTERRUPTS);

    let remainingPlayers = COMP.filter(player => !healers.includes(player) && !interrupts.slice(0, 6).includes(player));
    remainingPlayers = orderBy(remainingPlayers, 'parse');
    let groups = [[], [], []];
    for (let i = 0; i < remainingPlayers.length; i++) {
      groups[i % 3].push(remainingPlayers[i]);
    }
    groups[0].unshift(...healers.slice(0, 2));
    groups[1].unshift(...healers.slice(2, 4));
    groups[2].unshift(...healers.slice(4, 7));
    groups = groups.flat();
    setOutput(groups, RANGE_PLATFORM);
}

function bossHalfus() {
    const BOSS = 6;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'EO5:EO8';
    const RANGE_WHELPRELEASERS = 'EM11';
    const RANGE_SHADOWNOVA_SHAMAN = 'EM15';
    const RANGE_SHADOWNOVA_IMMUNITY = 'EM19:EM23';
    const RANGE_SHADOWNOVA_OTHERS = 'EP19:EP23';
    const RANGE_SCORCHINGBREATH = 'EU5:EU10';

    const mainTanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    const osTanks = COMP.filter(player => OSTANKS.includes(player));
    const tanks = [...new Set([...mainTanks, ...osTanks])];
    setOutput(tanks, RANGE_TANKS);

    const whelpReleasers = getByType(COMP, 'class', 'Hunter');
    setOutput(whelpReleasers, RANGE_WHELPRELEASERS);

    const shadowNovaShaman = orderBy(getByType(COMP, 'class', 'Shaman'), ['spec','Elemental','Restoration','Enhancement']);
    setOutput(shadowNovaShaman, RANGE_SHADOWNOVA_SHAMAN);

    const paladins = getByType(COMP, 'class', 'Paladin');
    setOutput(paladins, RANGE_SHADOWNOVA_IMMUNITY);

    const shadowNovaOthers = filterBy(orderBy(getAbility(COMP, 'interrupt'),'class'), true, 'role', 'Ranged');
    setOutput(shadowNovaOthers, RANGE_SHADOWNOVA_OTHERS);

    const scorchingBreath = getRaidCDs(COMP);
    setOutput(scorchingBreath, RANGE_SCORCHINGBREATH);
}

function bossAscendantCouncil() {
    const BOSS = 8;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = ''; // 2 tanks
    const RANGE_HYDROLANCE = ''; // melee interrupt
    const RANGE_DISPEL = ''; // magic dispel
    const RANGE_LIGHTNINGBLAST = ''; // ranged interrupt
    const RANGE_GLACIATE = ''; // raid CDs
    const RANGE_GRAVITYCRUSH = ''; // more raid CDs
    const RANGE_ELECTRICINSTABILITY = ''; // raid CDs, can reuse already listed CDs
    const RANGE_POSITIONING = ''; // healers and ranged

    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const hydroLance = filter(getAbility(COMP, 'interrupt'), 'role', 'Melee');
    setOutput(hydroLance, RANGE_HYDROLANCE);

    const magicDispel = orderBy(getAbility(COMP, 'dispel', 'magic'), ['spec', 'Discipline', 'Holy', 'Shadow', 'Restoration']);
    setOutput(magicDispel, RANGE_DISPEL);

    const lightningBlast = filter(getAbility(COMP, 'interrupt'), 'role', 'Ranged');
    setOutput(lightningBlast, RANGE_LIGHTNINGBLAST);

    const glaciate = getRaidCDs(COMP);
    setOutput(glaciate, RANGE_GLACIATE);

    const gravityCrush = getRaidCDs(COMP).filter(cd => !glaciate.includes(cd));
    setOutput(gravityCrush, RANGE_GRAVITYCRUSH);

    const electricInstability = getRaidCDs(COMP);
    setOutput(electricInstability, RANGE_ELECTRICINSTABILITY);

    const healersRanged = orderBy(getByType(COMP, 'role', 'Healer', 'Ranged'), 'role', 'class');
    setOutput(healersRanged, RANGE_POSITIONING);
}