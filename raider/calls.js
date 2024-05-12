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

function bossValionaAndTheralion() {
    const BOSS = 7;
    const COMP = COMPS[BOSS];
    const RANGE_TWILIGHT_1 = 'FA7:FA10';
    const RANGE_TWILIGHT_2 = 'FA12:FA15';
    const RANGE_BLACKOUT = 'FB18:FB23';
    const RANGE_POSITIONING = 'FJ6:FJ23';

    const tanks = getTanks(COMP);

    const twilightAll = COMP.filter(player => player !== tanks[0] && player !== tanks[1]);

    // Filter healers and order by preferred spec
    const healers = orderBy(getByType(twilightAll, 'role', 'Healer'), ['spec', 'Discipline', 'Restoration', 'Holy']);

    // If there are rogues, add them to both groups
    const rogues = getByType(twilightAll, 'class', 'Rogue');

    // Filter DPS and order by preferred spec
    const dps = orderBy(getByType(twilightAll, 'role', 'Melee', 'Ranged'),
    ['spec', 'Fire', 'Arcane', 'Frost', 'Unholy', 'Marksmanship', 'Beast Mastery', 'Survival', 'Feral', 'Enhancement',
    'Arms', 'Fury', 'Balance', 'Shadow', 'Affliction', 'Demonology', 'Destruction']).filter(dps => !rogues.includes(dps));

    // Create groups
    let group1 = [...healers.slice(0, 1), ...rogues, ...dps.slice(0, 4 - rogues.length)];
    let group2 = [...healers.slice(1, 2), ...rogues, ...dps.slice(4 - rogues.length, 8 - rogues.length)];

    // Output groups
    setOutput(group1, RANGE_TWILIGHT_1);
    setOutput(group2, RANGE_TWILIGHT_2);

    const blackout = getRaidCDs(COMP);
    setOutput(blackout, RANGE_BLACKOUT);

    const positioning = orderBy(getByType(COMP, 'role', 'Healer', 'Ranged'), 'role', 'class');
    setOutput(positioning, RANGE_POSITIONING);
}

function bossAscendantCouncil() {
    const BOSS = 8;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'FN6:FN7'; // 2 tanks
    const RANGE_HYDROLANCE = 'FP10:FP11'; // melee interrupt
    const RANGE_DISPEL = 'FO18'; // magic dispel
    const RANGE_LIGHTNINGBLAST = 'FP21:FP23'; // ranged interrupt
    const RANGE_GLACIATE = 'FW5:FW7'; // raid CDs
    const RANGE_GRAVITYCRUSH = 'FW10:FW12'; // more raid CDs
    const RANGE_ELECTRICINSTABILITY = 'FW15:FW23'; // raid CDs, can reuse already listed CDs
    const RANGE_POSITIONING = 'GD6:GD23'; // healers and ranged

    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const hydroLance = filterBy(getAbility(COMP, 'interrupt'), 'role', 'Melee');
    setOutput(hydroLance, RANGE_HYDROLANCE);

    const magicDispel = orderBy(getAbility(COMP, 'dispel', 'magic'), ['spec', 'Discipline', 'Holy', 'Shadow', 'Restoration']);
    setOutput(magicDispel, RANGE_DISPEL);

    const lightningBlast = filterBy(getAbility(COMP, 'interrupt'), 'role', 'Ranged');
    setOutput(lightningBlast, RANGE_LIGHTNINGBLAST);

    const glaciate = getRaidCDs(COMP);
    setOutput(glaciate, RANGE_GLACIATE);

    const gravityCrush = getRaidCDs(COMP).filter(cd => !glaciate.slice(0, 3).includes(cd));
    setOutput(gravityCrush, RANGE_GRAVITYCRUSH);

    const electricInstability = getRaidCDs(COMP);
    setOutput(electricInstability, RANGE_ELECTRICINSTABILITY);

    const healersRanged = orderBy(getByType(COMP, 'role', 'Healer', 'Ranged'), 'role', 'class');
    setOutput(healersRanged, RANGE_POSITIONING);
}

function bossChoGall() {
    const BOSS = 9;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'GL5:GL6'; // 2 tanks
    const RANGE_FLAMESORDERS = 'GL12:GL16'; // 5 Tank CDs for tanks[0]
    const RANGE_SHADOWSORDERS = 'GL19:GL23'; // 5 Raid CDs
    const RANGE_ADHERENT = 'GR6:GR7'; // 2 hunters
    const RANGE_DEPRAVITY = 'GS10:GS15'; // 2 groups of 3. [meleeInterrupt1, meleeInterrupt2, rangedInterrupt1],[meleeInterrupt3, meleeInterrupt4, rangedInterrupt2]
    const RANGE_LIFEGRIP = 'GQ19'; // 1 priest, order by spec: Discipline, Holy, Shadow
    const RANGE_BEAM = 'GY5:GY8'; // 4 interrupters, order by role: Melee, Ranged, Tank, Healer
    const RANGE_CORRUPTION = 'GY11:GY15'; // 5 raid CDs. Use Shadow's Orders CDs

    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const flamesOrders = getTankCDs(COMP, tanks[0], true).slice(0, 5);
    setOutput(flamesOrders, RANGE_FLAMESORDERS);

    const shadowsOrders = getRaidCDs(COMP);
    setOutput(shadowsOrders, RANGE_SHADOWSORDERS);

    const adherent = getByType(COMP, 'class', 'Hunter');
    setOutput(adherent, RANGE_ADHERENT);

    const interruptors = getAbility(COMP, 'interrupt');
    const meleeInterruptors = getByType(COMP, 'role', 'Melee').filter(player => interruptors.includes(player));
    const rangedInterruptors = getByType(COMP, 'role', 'Ranged').filter(player => interruptors.includes(player));

    const depravity = [
        meleeInterruptors[0], meleeInterruptors[1], rangedInterruptors[0], 
        meleeInterruptors[2], meleeInterruptors[3], rangedInterruptors[1]
    ];
    setOutput(depravity, RANGE_DEPRAVITY);

    const lifeGrip = orderBy(getByType(COMP, 'class', 'Priest'), ['spec', 'Discipline', 'Holy', 'Shadow']);
    setOutput(lifeGrip, RANGE_LIFEGRIP);

    const beam = orderBy(interruptors, 'role');
    setOutput(beam, RANGE_BEAM);

    const corruption = shadowsOrders;
    setOutput(corruption, RANGE_CORRUPTION);
}

function bossSinestra() {
    const BOSS = 10;
    const COMP = COMPS[BOSS];
    const RANGE_TANKS = 'HD6:HD7'; // 2 tanks
    const RANGE_WRACKDISPELS = 'HE10:HE11'; // 2x magic dispel, orderBy spec: Discipline, Holy, Shadow, Restoration
    const RANGE_WRACKCDS = 'HF14:HF15'; // 2x getCooldown target, not found in whelptankcds
    const RANGE_FLAMEBREATH = 'HG18:HG23'; // 6x RaidCDs
    const RANGE_EGGS_LEFT = 'HK6:HK12'; // All ranged and healers except for hunters and 2 healers, order by parse, split into 2 groups, at least 1 healer in each group
    const RANGE_EGGS_RIGHT = 'HN6:HN12'; // All ranged and healers except for hunters and 2 healers, order by parse, split into 2 groups, at least 1 healer in each group
    const RANGE_SPITECALLER = 'HM16:HM17'; // 2x getAbility threat from rogues or hunters, prefer rogues
    const RANGE_UNLEASHESSENCE = 'HM20:HM23'; // 4x  rogues, deathknights, or hunters preferred in that order
    const RANGE_WHELPKILLERS = 'HT6:HT11'; // 6x ranged dps, sort by parse
    const RANGE_WHELPTANKCDS = 'HT15:HT16'; // 2x get tank cds for tanks[1]

    const tanks = orderBy(getTanks(COMP), ['spec', 'Blood', 'Protection','Guardian']);
    setOutput(tanks, RANGE_TANKS);

    const wrackDispels = orderBy(getAbility(COMP, 'dispel', 'magic'), ['spec', 'Discipline', 'Holy', 'Shadow', 'Restoration']);
    setOutput(wrackDispels, RANGE_WRACKDISPELS);

    const cooldowns = getCooldown(COMP, 'target', ['dmgreduc']).filter(cd => !tanks.includes(cd));
    const tankCDs = cooldowns.slice(0, 2);
    const wrackCDs = cooldowns.slice(2);
    setOutput(wrackCDs, RANGE_WRACKCDS);

    const flameBreath = getRaidCDs(COMP);
    setOutput(flameBreath, RANGE_FLAMEBREATH);

    const rangedNoHunters = getByType(COMP, 'role', 'Ranged').filter(player => !getByType(COMP, 'class', 'Hunter').includes(player));
    const healers = getByType(COMP, 'role', 'Healer');
    let groups = [[], []];
    for (let i = 0; i < rangedNoHunters.length; i++) {
        groups[i % 2].push(rangedNoHunters[i]);
    }
    groups[0].unshift(...healers.slice(0, 2));
    groups[1].unshift(...healers.slice(2, 4));
    setOutput(groups[0], RANGE_EGGS_LEFT);
    setOutput(groups[1], RANGE_EGGS_RIGHT);

    const spiteCaller = orderBy(getCooldown(COMP, 'target', ['threatinc']),['class', 'Rogue', 'Hunter']);
    setOutput(spiteCaller, RANGE_SPITECALLER);

    const unleash = orderBy(getByType(COMP, 'class', 'Rogue', 'Death Knight', 'Hunter'), ['class', 'Rogue', 'Death Knight', 'Hunter']).filter(player => player !== tanks[0]);
    setOutput(unleash, RANGE_UNLEASHESSENCE);

    const whelpKillers = orderBy(getByType(COMP, 'role', 'Ranged'), 'parse').slice(0, 6);
    setOutput(whelpKillers, RANGE_WHELPKILLERS);

    
    setOutput(tankCDs, RANGE_WHELPTANKCDS);
}