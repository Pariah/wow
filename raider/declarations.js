const BOSSES = ['Magmaw','Omnotron Defense System','Chimaeron','Atramedes','Maloriak','Nefarian','Halfus Wyrmbreaker','Valiona and Theralion','Ascendant Council','Cho\'gall','Sinestra','Conclave of Wind','Al\'Akir'];
const CLASSES = ['Death Knight', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];
const ROLES = ['Tank','OSTank','Healer','OSHealer','Melee','Ranged'];
const SPECID = {
    250: { class: "Death Knight", spec: "Blood", role: "Tank" },
    251: { class: "Death Knight", spec: "Frost", role: "Melee" },
    252: { class: "Death Knight", spec: "Unholy", role: "Melee" },
    102: { class: "Druid", spec: "Balance", role: "Ranged" },
    103: { class: "Druid", spec: "Feral", role: "Melee" },
    104: { class: "Druid", spec: "Guardian", role: "Tank" },
    105: { class: "Druid", spec: "Restoration", role: "Healer" },
    253: { class: "Hunter", spec: "Beast Mastery", role: "Ranged" },
    254: { class: "Hunter", spec: "Marksmanship", role: "Ranged" },
    255: { class: "Hunter", spec: "Survival", role: "Ranged" },
    62 : { class: "Mage", spec: "Arcane", role: "Ranged" },
    63 : { class: "Mage", spec: "Fire", role: "Ranged" },
    64 : { class: "Mage", spec: "Frost", role: "Ranged" },
    65 : { class: "Paladin", spec: "Holy", role: "Healer" },
    66 : { class: "Paladin", spec: "Protection", role: "Tank" },
    70 : { class: "Paladin", spec: "Retribution", role: "Melee" },
    256: { class: "Priest", spec: "Discipline", role: "Healer" },
    257: { class: "Priest", spec: "Holy", role: "Healer" },
    258: { class: "Priest", spec: "Shadow", role: "Ranged" },
    259: { class: "Rogue", spec: "Assassination", role: "Melee" },
    260: { class: "Rogue", spec: "Combat", role: "Melee" },
    261: { class: "Rogue", spec: "Subtlety", role: "Melee" },
    262: { class: "Shaman", spec: "Elemental", role: "Ranged" },
    263: { class: "Shaman", spec: "Enhancement", role: "Melee" },
    264: { class: "Shaman", spec: "Restoration", role: "Healer" },
    265: { class: "Warlock", spec: "Affliction", role: "Ranged" },
    266: { class: "Warlock", spec: "Demonology", role: "Ranged" },
    267: { class: "Warlock", spec: "Destruction", role: "Ranged" },
    71 : { class: "Warrior", spec: "Arms", role: "Melee" },
    72 : { class: "Warrior", spec: "Fury", role: "Melee" },
    73 : { class: "Warrior", spec: "Protection", role: "Tank" },
};

const SHEET = SpreadsheetApp.getActiveSpreadsheet();
const SHEET_ROSTER = SHEET.getSheetByName('ROSTER');
const SHEET_COMP = SHEET.getSheetByName('COMP');
const SHEET_TIER = 'T11';
const RANGE_ROSTER = SHEET_ROSTER.getRange(2, 1, SHEET_ROSTER.getLastRow() - 1, SHEET_ROSTER.getLastColumn()).getValues();
const RANGE_COMP = SHEET_COMP.getRange(1, 1, SHEET_COMP.getLastRow(), SHEET_COMP.getLastColumn()).getValues();

const ROSTER = RANGE_ROSTER.map(([nick, char, specid, parse]) => ({ nick, char, specid, parse }));
const COMPS = RANGE_COMP[0].map((_, colIndex) => RANGE_COMP.map(row => row[colIndex]));
const OSTANKS = SHEET.getSheetByName(SHEET_TIER).getRange('T5:T7').getValues().flat().filter(value => value !== '');
const OSHEALERS = SHEET.getSheetByName(SHEET_TIER).getRange('T9:T13').getValues().flat().filter(value => value !== '');

const ABILITY = {
    'dispel': {
        'curse': [102, 103, 104, 105, 62, 63, 64, 262, 263, 264],
        'disease': [65, 66, 70, 256, 257, 258],
        'magic': [105, 65, 256, 257, 258, 264],
        'poison': [102, 103, 104, 105, 65, 66, 67],
    },
    'interrupt': [250, 251, 252, 103, 104, 62, 63, 64, 65, 66, 70, 259, 260, 261, 262, 263, 264, 71, 72, 73],
    'purge': {
        'enrage': [102, 103, 104, 105, 253, 254, 255, 259, 260, 261],
        'magic': [62, 63, 64, 256, 257, 258, 262, 263, 264, 73]
    }
}

const COOLDOWN = {  
    'personal': {
        'dmgreduc': {
            'all': [250, 251, 252, 102, 103, 104, 65, 66, 70, 258, 263, 71, 72, 73],
            'magic': [250, 251, 252],
            'physical': [250]
        },
        'health': [250, 104, 73],
        'immunity': {
            'all': [253, 254, 255],
            'cc': [250, 251, 252],
            'magic': [259, 260, 261],
            'fear': [71, 72, 73],
        }
    },
    'raid': {
        'armor': [71, 72, 73],
        'aura': [65],
        'dmgreduc': [66, 256],
        'heal': [102, 103, 104, 105, 256, 257, 258, 264],
        'health': [71, 72, 73],
        'immunity': {
            'magic': [262, 263, 264],
            'fear': [262, 263, 264],
        },
        'mana': [256, 257, 258, 264],
        'move': [102, 103, 104, 105, 253, 254, 255],
    },
    'target': {
        'brez': [250, 251, 252, 102, 103, 104, 105, 265, 266, 267],
        'dmginc': [256],
        'dmgreduc': [65, 66, 70, 256],
        'haste': [265, 266, 267],
        'heal': [65, 66, 70, 257],
        'immunity': {
            'fear': [256, 257, 258],
            'move': [65, 66, 70],
            'physical': [65, 66, 70],
        },
        'mana': [102, 103, 104, 105],
        'move': [256, 257, 258],
        'spellcrit': [62],
        'threatinc': [253, 254, 255, 259, 260, 261],
        'threatreduc': [65, 66, 70],
    },
}