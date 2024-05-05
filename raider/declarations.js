const BOSSES = ['Magmaw','Omnotron Defense System','Chimaeron','Atramedes','Maloriak','Nefarian','Halfus Wyrmbreaker','Valiona and Theralion','Ascendant Council','Cho\'gall','Sinestra','Conclave of Wind','Al\'Akir'];
const CLASSES = ['Death Knight', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];
const ROLES = ['Tank','Healer','Melee','Ranged'];
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