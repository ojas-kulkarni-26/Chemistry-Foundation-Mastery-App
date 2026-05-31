/* === DATABASES === */
window.ChemData = (function() {

  /* ---- IONS ---- */
  const IONS = [
    // MONOATOMIC CATIONS (Level 1)
    { id:'h',    name:'Hydrogen',          symbol:'H',  charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'li',   name:'Lithium',           symbol:'Li', charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'na',   name:'Sodium',            symbol:'Na', charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'k',    name:'Potassium',         symbol:'K',  charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'rb',   name:'Rubidium',          symbol:'Rb', charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'cs',   name:'Caesium',           symbol:'Cs', charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'ag',   name:'Silver',            symbol:'Ag', charge:1,  type:'cation', category:'monoatomic', level:1 },
    { id:'mg',   name:'Magnesium',         symbol:'Mg', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'ca',   name:'Calcium',           symbol:'Ca', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'sr',   name:'Strontium',         symbol:'Sr', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'ba',   name:'Barium',            symbol:'Ba', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'zn',   name:'Zinc',              symbol:'Zn', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'be',   name:'Beryllium',         symbol:'Be', charge:2,  type:'cation', category:'monoatomic', level:1 },
    { id:'al',   name:'Aluminium',         symbol:'Al', charge:3,  type:'cation', category:'monoatomic', level:1 },

    // POLYATOMIC CATIONS (Level 2)
    { id:'nh4',  name:'Ammonium',          symbol:'NH4', charge:1, type:'cation', category:'polyatomic', level:2 },
    { id:'h3o',  name:'Hydronium',         symbol:'H3O', charge:1, type:'cation', category:'polyatomic', level:2 },

    // VARIABLE VALENCY CATIONS (Level 3)
    { id:'cu1',  name:'Copper(I)',         symbol:'Cu', charge:1,  type:'cation', category:'variable', level:3, altName:'Cuprous' },
    { id:'cu2',  name:'Copper(II)',        symbol:'Cu', charge:2,  type:'cation', category:'variable', level:3, altName:'Cupric' },
    { id:'fe2',  name:'Iron(II)',          symbol:'Fe', charge:2,  type:'cation', category:'variable', level:3, altName:'Ferrous' },
    { id:'fe3',  name:'Iron(III)',         symbol:'Fe', charge:3,  type:'cation', category:'variable', level:3, altName:'Ferric' },
    { id:'pb2',  name:'Lead(II)',          symbol:'Pb', charge:2,  type:'cation', category:'variable', level:3, altName:'Plumbous' },
    { id:'pb4',  name:'Lead(IV)',          symbol:'Pb', charge:4,  type:'cation', category:'variable', level:3, altName:'Plumbic' },
    { id:'hg2',  name:'Mercury(II)',       symbol:'Hg', charge:2,  type:'cation', category:'variable', level:3, altName:'Mercuric' },
    { id:'sn2',  name:'Tin(II)',           symbol:'Sn', charge:2,  type:'cation', category:'variable', level:3, altName:'Stannous' },
    { id:'sn4',  name:'Tin(IV)',           symbol:'Sn', charge:4,  type:'cation', category:'variable', level:3, altName:'Stannic' },
    { id:'au3',  name:'Gold(III)',         symbol:'Au', charge:3,  type:'cation', category:'variable', level:3, altName:'Auric' },
    { id:'co2',  name:'Cobalt(II)',        symbol:'Co', charge:2,  type:'cation', category:'variable', level:3, altName:'Cobaltous' },
    { id:'co3',  name:'Cobalt(III)',       symbol:'Co', charge:3,  type:'cation', category:'variable', level:3, altName:'Cobaltic' },
    { id:'cr2',  name:'Chromium(II)',      symbol:'Cr', charge:2,  type:'cation', category:'variable', level:3, altName:'Chromous' },
    { id:'cr3',  name:'Chromium(III)',     symbol:'Cr', charge:3,  type:'cation', category:'variable', level:3, altName:'Chromic' },
    { id:'ni2',  name:'Nickel(II)',        symbol:'Ni', charge:2,  type:'cation', category:'variable', level:3, altName:'Nickelous' },
    { id:'mn2',  name:'Manganese(II)',     symbol:'Mn', charge:2,  type:'cation', category:'variable', level:3, altName:'Manganous' },
    { id:'mn4',  name:'Manganese(IV)',     symbol:'Mn', charge:4,  type:'cation', category:'variable', level:3, altName:'Manganic' },
    { id:'bi3',  name:'Bismuth(III)',      symbol:'Bi', charge:3,  type:'cation', category:'variable', level:3, altName:'Bismuthic' },
    { id:'sb3',  name:'Antimony(III)',     symbol:'Sb', charge:3,  type:'cation', category:'variable', level:3, altName:'Antimonous' },
    { id:'as3',  name:'Arsenic(III)',      symbol:'As', charge:3,  type:'cation', category:'variable', level:3, altName:'Arsenious' },
    { id:'pt2',  name:'Platinum(II)',      symbol:'Pt', charge:2,  type:'cation', category:'variable', level:3, altName:'Platinous' },
    { id:'pt4',  name:'Platinum(IV)',      symbol:'Pt', charge:4,  type:'cation', category:'variable', level:3, altName:'Platinic' },
    { id:'pd2',  name:'Palladium(II)',     symbol:'Pd', charge:2,  type:'cation', category:'variable', level:3, altName:'Palladous' },

    // MONOATOMIC ANIONS (Level 1)
    { id:'f',    name:'Fluoride',          symbol:'F',  charge:-1, type:'anion', category:'monoatomic', level:1 },
    { id:'cl',   name:'Chloride',          symbol:'Cl', charge:-1, type:'anion', category:'monoatomic', level:1 },
    { id:'br',   name:'Bromide',           symbol:'Br', charge:-1, type:'anion', category:'monoatomic', level:1 },
    { id:'i',    name:'Iodide',            symbol:'I',  charge:-1, type:'anion', category:'monoatomic', level:1 },
    { id:'hy',   name:'Hydride',           symbol:'H',  charge:-1, type:'anion', category:'monoatomic', level:1 },
    { id:'o',    name:'Oxide',             symbol:'O',  charge:-2, type:'anion', category:'monoatomic', level:1 },
    { id:'s',    name:'Sulphide',          symbol:'S',  charge:-2, type:'anion', category:'monoatomic', level:1 },
    { id:'n',    name:'Nitride',           symbol:'N',  charge:-3, type:'anion', category:'monoatomic', level:1 },
    { id:'p',    name:'Phosphide',         symbol:'P',  charge:-3, type:'anion', category:'monoatomic', level:1 },

    // POLYATOMIC ANIONS (Level 2)
    { id:'oh',   name:'Hydroxide',         symbol:'OH', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'no3',  name:'Nitrate',           symbol:'NO3', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'no2',  name:'Nitrite',           symbol:'NO2', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'hco3', name:'Hydrogen Carbonate',symbol:'HCO3',charge:-1, type:'anion', category:'polyatomic', level:2, altName:'Bicarbonate' },
    { id:'ch3coo',name:'Acetate',          symbol:'CH3COO',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'clo',  name:'Hypochlorite',      symbol:'ClO', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'clo2', name:'Chlorite',          symbol:'ClO2',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'clo3', name:'Chlorate',          symbol:'ClO3',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'clo4', name:'Perchlorate',       symbol:'ClO4',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'mno4', name:'Permanganate',      symbol:'MnO4',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'cn',   name:'Cyanide',           symbol:'CN',  charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'hso4', name:'Hydrogen Sulfate',  symbol:'HSO4',charge:-1, type:'anion', category:'polyatomic', level:2, altName:'Bisulfate' },
    { id:'scn',  name:'Thiocyanate',       symbol:'SCN', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'no',   name:'Nitrosyl',          symbol:'NO',  charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'io3',  name:'Iodate',            symbol:'IO3', charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'bro3', name:'Bromate',           symbol:'BrO3',charge:-1, type:'anion', category:'polyatomic', level:2 },
    { id:'so4',  name:'Sulfate',           symbol:'SO4', charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'so3',  name:'Sulfite',           symbol:'SO3', charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'co3',  name:'Carbonate',         symbol:'CO3', charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'cro4', name:'Chromate',          symbol:'CrO4',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'cr2o7',name:'Dichromate',        symbol:'Cr2O7',charge:-2,type:'anion', category:'polyatomic', level:2 },
    { id:'c2o4', name:'Oxalate',           symbol:'C2O4',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'s2o3', name:'Thiosulphate',      symbol:'S2O3',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'hpo4', name:'Hydrogen Phosphate',symbol:'HPO4',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'o2',   name:'Peroxide',          symbol:'O2',  charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'seo4', name:'Selenate',          symbol:'SeO4',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'sio3', name:'Silicate',          symbol:'SiO3',charge:-2, type:'anion', category:'polyatomic', level:2 },
    { id:'po4',  name:'Phosphate',         symbol:'PO4', charge:-3, type:'anion', category:'polyatomic', level:2 },
    { id:'po3',  name:'Phosphite',         symbol:'PO3', charge:-3, type:'anion', category:'polyatomic', level:2 },
    { id:'bo3',  name:'Borate',            symbol:'BO3', charge:-3, type:'anion', category:'polyatomic', level:2 },
    { id:'aso4', name:'Arsenate',          symbol:'AsO4',charge:-3, type:'anion', category:'polyatomic', level:2 },
    { id:'sb4',  name:'Antimonate',        symbol:'SbO4',charge:-3, type:'anion', category:'polyatomic', level:2 },
  ];

  const ionMap = {};
  IONS.forEach(ion => { ionMap[ion.id] = ion; });

  function getIon(id) { return ionMap[id]; }

  /* ---- COMPOUNDS ---- */
  const COMPOUND_PAIRS = [
    // Sodium compounds
    { cation:'na', anion:'cl' }, { cation:'na', anion:'so4' }, { cation:'na', anion:'no3' },
    { cation:'na', anion:'no2' }, { cation:'na', anion:'co3' }, { cation:'na', anion:'hco3' },
    { cation:'na', anion:'oh' },  { cation:'na', anion:'po4' }, { cation:'na', anion:'ch3coo' },
    { cation:'na', anion:'mno4' },{ cation:'na', anion:'o' },   { cation:'na', anion:'s' },
    { cation:'na', anion:'hy' },  { cation:'na', anion:'cn' },  { cation:'na', anion:'scn' },
    { cation:'na', anion:'io3' }, { cation:'na', anion:'bro3' },{ cation:'na', anion:'o2' },
    { cation:'na', anion:'c2o4' },{ cation:'na', anion:'bo3' }, { cation:'na', anion:'aso4' },
    // Potassium compounds
    { cation:'k',  anion:'cl' },  { cation:'k',  anion:'so4' }, { cation:'k',  anion:'no3' },
    { cation:'k',  anion:'co3' }, { cation:'k',  anion:'oh' },  { cation:'k',  anion:'mno4' },
    { cation:'k',  anion:'cro4' },{ cation:'k',  anion:'cr2o7' },{ cation:'k',  anion:'cn' },
    { cation:'k',  anion:'scn' }, { cation:'k',  anion:'io3' }, { cation:'k',  anion:'bro3' },
    { cation:'k',  anion:'c2o4' },{ cation:'k',  anion:'s2o3' },{ cation:'k',  anion:'o2' },
    // Calcium compounds
    { cation:'ca', anion:'cl' },  { cation:'ca', anion:'so4' }, { cation:'ca', anion:'no3' },
    { cation:'ca', anion:'co3' }, { cation:'ca', anion:'oh' },  { cation:'ca', anion:'po4' },
    { cation:'ca', anion:'o' },   { cation:'ca', anion:'f' },   { cation:'ca', anion:'c2o4' },
    { cation:'ca', anion:'hpo4' },{ cation:'ca', anion:'s' },   { cation:'ca', anion:'sio3' },
    // Magnesium compounds
    { cation:'mg', anion:'cl' },  { cation:'mg', anion:'so4' }, { cation:'mg', anion:'no3' },
    { cation:'mg', anion:'oh' },  { cation:'mg', anion:'co3' }, { cation:'mg', anion:'o' },
    { cation:'mg', anion:'c2o4' },{ cation:'mg', anion:'po4' }, { cation:'mg', anion:'sio3' },
    // Barium compounds
    { cation:'ba', anion:'cl' },  { cation:'ba', anion:'so4' }, { cation:'ba', anion:'no3' },
    { cation:'ba', anion:'oh' },  { cation:'ba', anion:'co3' }, { cation:'ba', anion:'c2o4' },
    { cation:'ba', anion:'cro4' },{ cation:'ba', anion:'o2' },
    // Zinc compounds
    { cation:'zn', anion:'cl' },  { cation:'zn', anion:'so4' }, { cation:'zn', anion:'no3' },
    { cation:'zn', anion:'oh' },  { cation:'zn', anion:'co3' }, { cation:'zn', anion:'s' },
    { cation:'zn', anion:'c2o4' },{ cation:'zn', anion:'po4' }, { cation:'zn', anion:'sio3' },
    // Iron(II) compounds
    { cation:'fe2',anion:'cl' },  { cation:'fe2',anion:'so4' },{ cation:'fe2',anion:'no3' },
    { cation:'fe2',anion:'oh' },  { cation:'fe2',anion:'co3' },{ cation:'fe2',anion:'s' },
    { cation:'fe2',anion:'c2o4' },{ cation:'fe2',anion:'po4' },{ cation:'fe2',anion:'cro4' },
    // Iron(III) compounds
    { cation:'fe3',anion:'cl' },  { cation:'fe3',anion:'so4' },{ cation:'fe3',anion:'no3' },
    { cation:'fe3',anion:'oh' },  { cation:'fe3',anion:'o' },  { cation:'fe3',anion:'po4' },
    { cation:'fe3',anion:'c2o4' },{ cation:'fe3',anion:'scn' },{ cation:'fe3',anion:'cro4' },
    // Copper(II) compounds
    { cation:'cu2',anion:'cl' },  { cation:'cu2',anion:'so4' },{ cation:'cu2',anion:'no3' },
    { cation:'cu2',anion:'oh' },  { cation:'cu2',anion:'o' },  { cation:'cu2',anion:'co3' },
    { cation:'cu2',anion:'s' },   { cation:'cu2',anion:'c2o4' },{ cation:'cu2',anion:'po4' },
    // Copper(I) compounds
    { cation:'cu1',anion:'cl' },  { cation:'cu1',anion:'o' },  { cation:'cu1',anion:'s' },
    { cation:'cu1',anion:'cn' },  { cation:'cu1',anion:'scn' },{ cation:'cu1',anion:'i' },
    // Aluminium compounds
    { cation:'al', anion:'cl' },  { cation:'al', anion:'so4' }, { cation:'al', anion:'no3' },
    { cation:'al', anion:'oh' },  { cation:'al', anion:'o' },   { cation:'al', anion:'po4' },
    { cation:'al', anion:'c2o4' },{ cation:'al', anion:'sio3' },{ cation:'al', anion:'bo3' },
    // Lead compounds
    { cation:'pb2',anion:'cl' },  { cation:'pb2',anion:'so4' },{ cation:'pb2',anion:'no3' },
    { cation:'pb2',anion:'s' },   { cation:'pb2',anion:'c2o4' },{ cation:'pb2',anion:'cro4' },
    { cation:'pb2',anion:'co3' }, { cation:'pb2',anion:'i' },  { cation:'pb2',anion:'oh' },
    // Lead(IV) compounds
    { cation:'pb4',anion:'o' },   { cation:'pb4',anion:'cl' },
    // Silver compounds
    { cation:'ag', anion:'cl' },  { cation:'ag', anion:'no3' }, { cation:'ag', anion:'br' },
    { cation:'ag', anion:'i' },   { cation:'ag', anion:'cn' },  { cation:'ag', anion:'scn' },
    { cation:'ag', anion:'c2o4' },{ cation:'ag', anion:'po4' }, { cation:'ag', anion:'cro4' },
    // Ammonium compounds
    { cation:'nh4',anion:'cl' },  { cation:'nh4',anion:'so4' },{ cation:'nh4',anion:'no3' },
    { cation:'nh4',anion:'co3' }, { cation:'nh4',anion:'oh' }, { cation:'nh4',anion:'po4' },
    { cation:'nh4',anion:'c2o4' },{ cation:'nh4',anion:'cro4' },{ cation:'nh4',anion:'s2o3' },
    { cation:'nh4',anion:'mno4' },{ cation:'nh4',anion:'cn' }, { cation:'nh4',anion:'scn' },
    // Cobalt compounds
    { cation:'co2',anion:'cl' },  { cation:'co2',anion:'so4' },{ cation:'co2',anion:'no3' },
    { cation:'co2',anion:'oh' },  { cation:'co2',anion:'co3' },{ cation:'co2',anion:'c2o4' },
    { cation:'co3',anion:'cl' },  { cation:'co3',anion:'so4' },{ cation:'co3',anion:'no3' },
    { cation:'co3',anion:'oh' },  { cation:'co3',anion:'o' },
    // Chromium compounds
    { cation:'cr3',anion:'cl' },  { cation:'cr3',anion:'so4' },{ cation:'cr3',anion:'no3' },
    { cation:'cr3',anion:'oh' },  { cation:'cr3',anion:'o' },  { cation:'cr3',anion:'po4' },
    { cation:'cr2',anion:'cl' },  { cation:'cr2',anion:'so4' },{ cation:'cr2',anion:'o' },
    // Nickel compounds
    { cation:'ni2',anion:'cl' },  { cation:'ni2',anion:'so4' },{ cation:'ni2',anion:'no3' },
    { cation:'ni2',anion:'oh' },  { cation:'ni2',anion:'co3' },{ cation:'ni2',anion:'c2o4' },
    // Manganese compounds
    { cation:'mn2',anion:'cl' },  { cation:'mn2',anion:'so4' },{ cation:'mn2',anion:'no3' },
    { cation:'mn2',anion:'oh' },  { cation:'mn2',anion:'co3' },{ cation:'mn2',anion:'c2o4' },
    { cation:'mn4',anion:'o' },   { cation:'mn4',anion:'cl' },
    // Bismuth compounds
    { cation:'bi3',anion:'cl' },  { cation:'bi3',anion:'no3' },{ cation:'bi3',anion:'so4' },
    { cation:'bi3',anion:'o' },   { cation:'bi3',anion:'s' },
    // Tin compounds
    { cation:'sn2',anion:'cl' },  { cation:'sn2',anion:'so4' },{ cation:'sn2',anion:'o' },
    { cation:'sn4',anion:'cl' },  { cation:'sn4',anion:'o' },
    // Mercury compounds
    { cation:'hg2',anion:'cl' },  { cation:'hg2',anion:'so4' },{ cation:'hg2',anion:'no3' },
    { cation:'hg2',anion:'o' },   { cation:'hg2',anion:'s' },
    // Antimony compounds
    { cation:'sb3',anion:'cl' },  { cation:'sb3',anion:'o' },  { cation:'sb3',anion:'s' },
    // Arsenic compounds
    { cation:'as3',anion:'cl' },  { cation:'as3',anion:'o' },  { cation:'as3',anion:'s' },
    // Gold compounds
    { cation:'au3',anion:'cl' },  { cation:'au3',anion:'o' },  { cation:'au3',anion:'cn' },
    // Platinum compounds
    { cation:'pt2',anion:'cl' },  { cation:'pt2',anion:'o' },  { cation:'pt4',anion:'cl' },
    // Palladium compounds
    { cation:'pd2',anion:'cl' },  { cation:'pd2',anion:'o' },
    // Strontium compounds
    { cation:'sr', anion:'cl' },  { cation:'sr', anion:'no3' }, { cation:'sr', anion:'so4' },
    { cation:'sr', anion:'oh' },  { cation:'sr', anion:'co3' }, { cation:'sr', anion:'c2o4' },
    // Rubidium compounds
    { cation:'rb', anion:'cl' },  { cation:'rb', anion:'no3' }, { cation:'rb', anion:'so4' },
    { cation:'rb', anion:'oh' },  { cation:'rb', anion:'co3' },
    // Caesium compounds
    { cation:'cs', anion:'cl' },  { cation:'cs', anion:'no3' }, { cation:'cs', anion:'so4' },
    { cation:'cs', anion:'oh' },  { cation:'cs', anion:'co3' },
    // Beryllium compounds
    { cation:'be', anion:'cl' },  { cation:'be', anion:'so4' }, { cation:'be', anion:'no3' },
    { cation:'be', anion:'oh' },  { cation:'be', anion:'o' },
    // Hydronium compounds
    { cation:'h3o',anion:'cl' },  { cation:'h3o',anion:'so4' },{ cation:'h3o',anion:'no3' },
  ];

  function gcd(a, b) { while(b) { let t = b; b = a % b; a = t; } return a; }

  function wrapSymbol(sym, count, isPolyatomic) {
    if (count === 1) return sym;
    if (isPolyatomic || sym.length > 2) return '(' + sym + ')' + count;
    return sym + count;
  }

  function generateFormula(catId, anId) {
    let cat = getIon(catId), an = getIon(anId);
    let cCnt = Math.abs(an.charge), aCnt = Math.abs(cat.charge);
    let g = gcd(cCnt, aCnt);
    cCnt /= g; aCnt /= g;
    return wrapSymbol(cat.symbol, cCnt, cat.category === 'polyatomic')
         + wrapSymbol(an.symbol, aCnt, an.category === 'polyatomic');
  }

  let COMPOUNDS = null;
  function generateCompounds() {
    if (COMPOUNDS) return COMPOUNDS;
    COMPOUNDS = COMPOUND_PAIRS.map((p, i) => {
      let cat = getIon(p.cation), an = getIon(p.anion);
      let cCnt = Math.abs(an.charge), aCnt = Math.abs(cat.charge);
      let g = gcd(cCnt, aCnt);
      cCnt /= g; aCnt /= g;
      let maxLevel = Math.max(cat.level || 1, an.level || 1);
      return {
        id: p.cation + '_' + p.anion,
        name: cat.name + ' ' + an.name,
        formula: generateFormula(p.cation, p.anion),
        cationId: p.cation, anionId: p.anion,
        cationName: cat.name, anionName: an.name,
        cationSymbol: cat.symbol, anionSymbol: an.symbol,
        cationCharge: cat.charge, anionCharge: an.charge,
        cationCount: cCnt, anionCount: aCnt,
        level: maxLevel,
        difficulty: maxLevel,
        cat: cat, an: an
      };
    });
    return COMPOUNDS;
  }

  /* ---- REACTIONS ---- */
  const REACTIONS = [
    // COMBINATION (1-18)
    { id:1, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'Na',count:2},{formula:'Cl2',count:1}], products:[{formula:'NaCl',count:2}] },
      words:[{t:'Sodium reacts with chlorine to form table salt. Identify the products.',v:'products'},{t:'A silvery metal combines with a greenish-yellow gas. What is the product?',v:'products'}],
      distractors:['NaOH','Na2O','MgCl2','KCl','NaBr'] },
    { id:2, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'CaO',count:1},{formula:'H2O',count:1}], products:[{formula:'Ca(OH)2',count:1}] },
      words:[{t:'Calcium oxide reacts with water to form?',v:'products'},{t:'Quicklime (CaO) is added to water. What compound is formed?',v:'products'}],
      distractors:['CaCO3','CaCl2','CaSO4','CaO2','Mg(OH)2'] },
    { id:3, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'Mg',count:2},{formula:'O2',count:1}], products:[{formula:'MgO',count:2}] },
      words:[{t:'Magnesium burns in oxygen to produce?',v:'products'},{t:'A bright white flame is seen when magnesium ribbon is burnt. What is the white powder formed?',v:'products'}],
      distractors:['Mg(OH)2','MgCl2','MgCO3','Mg2O','MgO2'] },
    { id:4, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'H2',count:2},{formula:'O2',count:1}], products:[{formula:'H2O',count:2}] },
      words:[{t:'Hydrogen gas burns in oxygen to form?',v:'products'}],
      distractors:['H2O2','HO','H2','O3','OH'] },
    { id:5, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'N2',count:1},{formula:'H2',count:3}], products:[{formula:'NH3',count:2}] },
      words:[{t:'Nitrogen and hydrogen combine in the Haber process to give?',v:'products'}],
      distractors:['NO','NO2','N2H4','NH4','N2O'] },
    { id:6, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'SO2',count:1},{formula:'O2',count:1}], products:[{formula:'SO3',count:1}] },
      words:[{t:'Sulfur dioxide reacts with oxygen to form? (Contact process step)',v:'products'}],
      distractors:['SO','S2O','H2SO4','SO4','S2O3'] },
    { id:7, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'SO3',count:1},{formula:'H2O',count:1}], products:[{formula:'H2SO4',count:1}] },
      words:[{t:'Sulfur trioxide dissolves in water to give?',v:'products'}],
      distractors:['H2SO3','SO2','H2S','H2S2O3','H2O'] },
    { id:8, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'CO2',count:1},{formula:'H2O',count:1}], products:[{formula:'H2CO3',count:1}] },
      words:[{t:'Carbon dioxide dissolves in water to form?',v:'products'}],
      distractors:['HCO3','CO','C2H5OH','H2C2O4','CaCO3'] },
    { id:9, type:'combination', difficulty:2,
      equation:{ reactants:[{formula:'Fe',count:2},{formula:'Cl2',count:3}], products:[{formula:'FeCl3',count:2}] },
      words:[{t:'Iron reacts with chlorine gas to form?',v:'products'}],
      distractors:['FeCl2','FeCl','Fe2Cl','Fe2Cl3','Fe3Cl2'] },
    { id:10, type:'combination', difficulty:2,
      equation:{ reactants:[{formula:'Al',count:2},{formula:'Cl2',count:3}], products:[{formula:'AlCl3',count:2}] },
      words:[{t:'Aluminium combines with chlorine gas to give?',v:'products'}],
      distractors:['AlCl','AlCl2','Al2Cl','Al2Cl3','Al3Cl'] },
    { id:11, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'Ca',count:1},{formula:'Cl2',count:1}], products:[{formula:'CaCl2',count:1}] },
      words:[{t:'Calcium burns in chlorine gas to form?',v:'products'}],
      distractors:['CaCl','CaCl3','Ca2Cl','KCl','MgCl2'] },
    { id:12, type:'combination', difficulty:1,
      equation:{ reactants:[{formula:'Na',count:2},{formula:'O2',count:1}], products:[{formula:'Na2O',count:2}] },
      words:[{t:'Sodium combines with oxygen to form?',v:'products'}],
      distractors:['NaO','Na2O2','NaOH','Na2CO3','NaCl'] },
    { id:61, type:'combination', difficulty:2,
      equation:{ reactants:[{formula:'C',count:1},{formula:'O2',count:1}], products:[{formula:'CO2',count:1}] },
      words:[{t:'Carbon burns in excess oxygen to form?',v:'products'}],
      distractors:['CO','CO2','C2O','C2O2','CO3'] },
    { id:62, type:'combination', difficulty:2,
      equation:{ reactants:[{formula:'2C',count:1},{formula:'O2',count:1}], products:[{formula:'2CO',count:1}] },
      words:[{t:'Carbon burns in limited oxygen to form?',v:'products'}],
      distractors:['CO2','C2O','C2O2','CO3','C'] },
    { id:63, type:'combination', difficulty:2,
      equation:{ reactants:[{formula:'P4',count:1},{formula:'O2',count:5}], products:[{formula:'P4O10',count:1}] },
      words:[{t:'Phosphorus burns in excess air to form?',v:'products'}],
      distractors:['P2O5','PO2','P2O3','P4O6','PO'] },
    { id:64, type:'combination', difficulty:3,
      equation:{ reactants:[{formula:'Fe2O3',count:1},{formula:'Al',count:2}], products:[{formula:'Al2O3',count:1},{formula:'Fe',count:2}] },
      words:[{t:'Iron(III) oxide reacts with aluminium in the thermite reaction. What are the products?',v:'products'}],
      distractors:['Fe3O4','AlFe','Al2O','FeO','Al3O2'] },
    { id:65, type:'combination', difficulty:3,
      equation:{ reactants:[{formula:'N2',count:1},{formula:'O2',count:1}], products:[{formula:'NO',count:2}] },
      words:[{t:'Nitrogen and oxygen combine at high temperatures (lightning) to form?',v:'products'}],
      distractors:['NO2','N2O','N2O3','N2O4','N2O5'] },
    { id:66, type:'combination', difficulty:3,
      equation:{ reactants:[{formula:'NO',count:2},{formula:'O2',count:1}], products:[{formula:'NO2',count:2}] },
      words:[{t:'Nitric oxide reacts with oxygen to form?',v:'products'}],
      distractors:['N2O','N2O3','N2O4','N2O5','NO3'] },

    // DECOMPOSITION (13-22 + new)
    { id:13, type:'decomposition', difficulty:1,
      equation:{ reactants:[{formula:'H2O',count:2}], products:[{formula:'H2',count:2},{formula:'O2',count:1}] },
      words:[{t:'Water undergoes electrolysis to give?',v:'products'}],
      distractors:['HO','H2O2','H2O','OH','H3O'] },
    { id:14, type:'decomposition', difficulty:1,
      equation:{ reactants:[{formula:'CaCO3',count:1}], products:[{formula:'CaO',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Limestone (CaCO3) is heated strongly. What are the products?',v:'products'}],
      distractors:['Ca(OH)2','Ca','CaC2','CO','CaCO2'] },
    { id:15, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'KClO3',count:2}], products:[{formula:'KCl',count:2},{formula:'O2',count:3}] },
      words:[{t:'Potassium chlorate decomposes on heating (with MnO2 catalyst) to give?',v:'products'}],
      distractors:['KClO','KClO2','K2O','Cl2','KCl2'] },
    { id:16, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'KMnO4',count:2}], products:[{formula:'K2MnO4',count:1},{formula:'MnO2',count:1},{formula:'O2',count:1}] },
      words:[{t:'Potassium permanganate decomposes on strong heating. Identify the products.',v:'products'}],
      distractors:['KMnO3','Mn2O3','K2O','MnO3','K2MnO3'] },
    { id:17, type:'decomposition', difficulty:1,
      equation:{ reactants:[{formula:'H2O2',count:2}], products:[{formula:'H2O',count:2},{formula:'O2',count:1}] },
      words:[{t:'Hydrogen peroxide decomposes slowly to give water and?',v:'products'}],
      distractors:['H2','HO','O3','H2O','O'] },
    { id:18, type:'decomposition', difficulty:1,
      equation:{ reactants:[{formula:'NH4Cl',count:1}], products:[{formula:'NH3',count:1},{formula:'HCl',count:1}] },
      words:[{t:'Ammonium chloride on heating sublimes and decomposes into?',v:'products'}],
      distractors:['N2','Cl2','NH2Cl','N2H4','NH4'] },
    { id:19, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'Pb(NO3)2',count:2}], products:[{formula:'PbO',count:2},{formula:'NO2',count:4},{formula:'O2',count:1}] },
      words:[{t:'Lead nitrate crystals are heated strongly. Brown fumes evolve. What are the products?',v:'products'}],
      distractors:['Pb(NO2)2','NO','N2O','Pb2O','PbO2'] },
    { id:20, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'FeSO4',count:2}], products:[{formula:'Fe2O3',count:1},{formula:'SO2',count:1},{formula:'SO3',count:1}] },
      words:[{t:'Ferrous sulfate crystals are heated strongly. What are the decomposition products?',v:'products'}],
      distractors:['FeO','FeS','S','Fe2(SO4)3','Fe3O4'] },
    { id:21, type:'decomposition', difficulty:1,
      equation:{ reactants:[{formula:'Ca(OH)2',count:1}], products:[{formula:'CaO',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Calcium hydroxide decomposes on strong heating to give?',v:'products'}],
      distractors:['CaH2','Ca2O','CaO2','CaCO3','Ca(OH)'] },
    { id:22, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'2AgCl',count:2}], products:[{formula:'Ag',count:2},{formula:'Cl2',count:1}] },
      words:[{t:'Silver chloride turns grey in sunlight. What does it decompose into?',v:'products'}],
      distractors:['AgCl2','Ag2Cl','Ag2O','ClO','Ag'] },
    { id:67, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'Cu(OH)2',count:1}], products:[{formula:'CuO',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Copper(II) hydroxide is heated. A black solid forms. What are the products?',v:'products'}],
      distractors:['Cu2O','CuO2','Cu2O3','Cu(OH)','CuH2'] },
    { id:68, type:'decomposition', difficulty:2,
      equation:{ reactants:[{formula:'MgCO3',count:1}], products:[{formula:'MgO',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Magnesium carbonate decomposes on heating. What are the products?',v:'products'}],
      distractors:['Mg(OH)2','MgCO2','Mg2O','CO','MgO2'] },
    { id:69, type:'decomposition', difficulty:3,
      equation:{ reactants:[{formula:'(NH4)2Cr2O7',count:1}], products:[{formula:'Cr2O3',count:1},{formula:'N2',count:1},{formula:'H2O',count:4}] },
      words:[{t:'Ammonium dichromate decomposes on heating in a volcano-like reaction. Identify the products.',v:'products'}],
      distractors:['CrO3','NH3','NO2','Cr2O','N2O'] },
    { id:70, type:'decomposition', difficulty:3,
      equation:{ reactants:[{formula:'ZnCO3',count:1}], products:[{formula:'ZnO',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Zinc carbonate is heated strongly. What are the products?',v:'products'}],
      distractors:['Zn(OH)2','ZnCO2','Zn2O','CO','ZnO2'] },
    { id:71, type:'decomposition', difficulty:3,
      equation:{ reactants:[{formula:'NaHCO3',count:2}], products:[{formula:'Na2CO3',count:1},{formula:'H2O',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Sodium bicarbonate decomposes on heating (baking soda). What are the products?',v:'products'}],
      distractors:['NaOH','NaO','Na2O','CO','NaCO3'] },

    // SINGLE DISPLACEMENT (23-32 + new)
    { id:23, type:'displacement', difficulty:1,
      equation:{ reactants:[{formula:'Zn',count:1},{formula:'CuSO4',count:1}], products:[{formula:'ZnSO4',count:1},{formula:'Cu',count:1}] },
      words:[{t:'Zinc metal is added to blue copper sulfate solution. What happens?',v:'products'}],
      distractors:['ZnCl2','Cu','Cu2O','ZnO','CuSO3'] },
    { id:24, type:'displacement', difficulty:1,
      equation:{ reactants:[{formula:'Fe',count:1},{formula:'CuSO4',count:1}], products:[{formula:'FeSO4',count:1},{formula:'Cu',count:1}] },
      words:[{t:'Iron nail is dipped in copper sulfate solution. What are the products?',v:'products'}],
      distractors:['Fe2(SO4)3','FeO','Cu2O','FeCl2','CuO'] },
    { id:25, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Cu',count:1},{formula:'AgNO3',count:2}], products:[{formula:'Cu(NO3)2',count:1},{formula:'Ag',count:2}] },
      words:[{t:'Copper wire is placed in silver nitrate solution. Identify the products.',v:'products'}],
      distractors:['CuNO3','Cu(NO2)2','Ag2O','Cu2O','AgNO2'] },
    { id:26, type:'displacement', difficulty:1,
      equation:{ reactants:[{formula:'Zn',count:1},{formula:'HCl',count:2}], products:[{formula:'ZnCl2',count:1},{formula:'H2',count:1}] },
      words:[{t:'Zinc reacts with hydrochloric acid to produce zinc chloride and?',v:'products'}],
      distractors:['Cl2','O2','ZnH2','H2O','HCl'] },
    { id:27, type:'displacement', difficulty:1,
      equation:{ reactants:[{formula:'Mg',count:1},{formula:'HCl',count:2}], products:[{formula:'MgCl2',count:1},{formula:'H2',count:1}] },
      words:[{t:'Magnesium ribbon reacts with dilute hydrochloric acid to give?',v:'products'}],
      distractors:['MgH2','Cl2','MgO','H2O','MgCl'] },
    { id:28, type:'displacement', difficulty:1,
      equation:{ reactants:[{formula:'Na',count:2},{formula:'H2O',count:2}], products:[{formula:'NaOH',count:2},{formula:'H2',count:1}] },
      words:[{t:'Sodium metal reacts vigorously with water. What are the products?',v:'products'}],
      distractors:['Na2O','NaH','O2','Na2O2','OH'] },
    { id:29, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Cl2',count:1},{formula:'KBr',count:2}], products:[{formula:'KCl',count:2},{formula:'Br2',count:1}] },
      words:[{t:'Chlorine gas is passed through potassium bromide solution. What is formed?',v:'products'}],
      distractors:['KClO3','KBrO3','ClBr','KCl2','BrCl'] },
    { id:30, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Br2',count:1},{formula:'KI',count:2}], products:[{formula:'KBr',count:2},{formula:'I2',count:1}] },
      words:[{t:'Bromine water is added to potassium iodide solution. Identify the products.',v:'products'}],
      distractors:['KBrO3','KIO3','BrI','KBr2','IBr'] },
    { id:31, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Fe',count:1},{formula:'CuCl2',count:1}], products:[{formula:'FeCl2',count:1},{formula:'Cu',count:1}] },
      words:[{t:'Iron is placed in copper(II) chloride solution. What are the products?',v:'products'}],
      distractors:['FeCl3','Fe2Cl','CuCl','FeCu','Cu2Cl2'] },
    { id:32, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Zn',count:1},{formula:'FeSO4',count:1}], products:[{formula:'ZnSO4',count:1},{formula:'Fe',count:1}] },
      words:[{t:'Zinc is added to ferrous sulfate solution. What is formed?',v:'products'}],
      distractors:['ZnFe','Zn2SO4','Fe2(SO4)3','ZnO','FeSO3'] },
    { id:72, type:'displacement', difficulty:2,
      equation:{ reactants:[{formula:'Cu',count:1},{formula:'Hg(NO3)2',count:1}], products:[{formula:'Cu(NO3)2',count:1},{formula:'Hg',count:1}] },
      words:[{t:'Copper is placed in mercury(II) nitrate solution. What are the products?',v:'products'}],
      distractors:['CuNO3','Cu(NO3)','HgO','Cu2O','HgNO3'] },
    { id:73, type:'displacement', difficulty:3,
      equation:{ reactants:[{formula:'Al',count:2},{formula:'Fe2O3',count:1}], products:[{formula:'Al2O3',count:1},{formula:'Fe',count:2}] },
      words:[{t:'Aluminium displaces iron from iron(III) oxide (thermite reaction). Identify the products.',v:'products'}],
      distractors:['Fe3O4','AlFe','Al2O','FeO','Al3O2'] },
    { id:74, type:'displacement', difficulty:3,
      equation:{ reactants:[{formula:'Mg',count:1},{formula:'H2O',count:2}], products:[{formula:'Mg(OH)2',count:1},{formula:'H2',count:1}] },
      words:[{t:'Magnesium reacts with hot water/steam. What are the products?',v:'products'}],
      distractors:['MgO','MgH2','O2','MgOH','H2O'] },

    // DOUBLE DISPLACEMENT (33-44 + new)
    { id:33, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'NaCl',count:1},{formula:'AgNO3',count:1}], products:[{formula:'AgCl',count:1},{formula:'NaNO3',count:1}] },
      words:[{t:'Sodium chloride solution reacts with silver nitrate. A white precipitate forms. Identify the products.',v:'products'}],
      distractors:['NaNO2','Ag2O','AgCl2','Na2Cl','AgNO2'] },
    { id:34, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'BaCl2',count:1},{formula:'Na2SO4',count:1}], products:[{formula:'BaSO4',count:1},{formula:'NaCl',count:2}] },
      words:[{t:'Barium chloride reacts with sodium sulfate. A white precipitate forms. What are the products?',v:'products'}],
      distractors:['BaSO3','Na2SO3','BaCl','Ba2SO4','Na2Cl2'] },
    { id:35, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'Pb(NO3)2',count:1},{formula:'KI',count:2}], products:[{formula:'PbI2',count:1},{formula:'KNO3',count:2}] },
      words:[{t:'Lead nitrate reacts with potassium iodide. A bright yellow precipitate forms. Identify the products.',v:'products'}],
      distractors:['PbI','PbI3','KNO2','Pb(NO2)2','K2I'] },
    { id:36, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'NaOH',count:1},{formula:'HCl',count:1}], products:[{formula:'NaCl',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Sodium hydroxide is neutralized by hydrochloric acid. What are the products?',v:'products'}],
      distractors:['NaOCl','NaOH','Cl2','NaH','NaClO'] },
    { id:37, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'Na2CO3',count:1},{formula:'HCl',count:2}], products:[{formula:'NaCl',count:2},{formula:'H2O',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Sodium carbonate reacts with hydrochloric acid. Effervescence occurs. Identify all products.',v:'products'}],
      distractors:['NaHCO3','Cl2','Na2O','CO','NaClO3'] },
    { id:38, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'NaHCO3',count:1},{formula:'HCl',count:1}], products:[{formula:'NaCl',count:1},{formula:'H2O',count:1},{formula:'CO2',count:1}] },
      words:[{t:'Sodium bicarbonate reacts with hydrochloric acid. What are the products?',v:'products'}],
      distractors:['Na2CO3','Cl2','NaH','CO','NaOH'] },
    { id:39, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'FeSO4',count:1},{formula:'NaOH',count:2}], products:[{formula:'Fe(OH)2',count:1},{formula:'Na2SO4',count:1}] },
      words:[{t:'Ferrous sulfate reacts with sodium hydroxide. A green precipitate forms. Identify the products.',v:'products'}],
      distractors:['Fe(OH)3','Na2SO3','FeO','NaFe','FeSO3'] },
    { id:40, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'FeCl3',count:1},{formula:'NaOH',count:3}], products:[{formula:'Fe(OH)3',count:1},{formula:'NaCl',count:3}] },
      words:[{t:'Ferric chloride reacts with sodium hydroxide. A reddish-brown precipitate forms. Identify the products.',v:'products'}],
      distractors:['Fe(OH)2','FeCl2','NaFe','NaClO','Fe2O3'] },
    { id:41, type:'double_displacement', difficulty:1,
      equation:{ reactants:[{formula:'CuSO4',count:1},{formula:'NaOH',count:2}], products:[{formula:'Cu(OH)2',count:1},{formula:'Na2SO4',count:1}] },
      words:[{t:'Copper sulfate reacts with sodium hydroxide. A blue precipitate forms. Identify the products.',v:'products'}],
      distractors:['CuO','CuOH','Na2SO3','Cu2O','NaCu'] },
    { id:42, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'(NH4)2SO4',count:1},{formula:'NaOH',count:2}], products:[{formula:'NH3',count:2},{formula:'H2O',count:2},{formula:'Na2SO4',count:1}] },
      words:[{t:'Ammonium sulfate is heated with sodium hydroxide. Ammonia gas evolves. What are all the products?',v:'products'}],
      distractors:['NH4OH','Na2SO3','N2','NO2','NaNH4'] },
    { id:43, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'AgNO3',count:2},{formula:'KCl',count:2}], products:[{formula:'AgCl',count:2},{formula:'KNO3',count:2}] },
      words:[{t:'Silver nitrate reacts with potassium chloride. A white curdy precipitate forms. What are the products?',v:'products'}],
      distractors:['AgCl2','AgNO2','KClO3','Ag2O','KNO2'] },
    { id:44, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'Pb(NO3)2',count:1},{formula:'NaCl',count:2}], products:[{formula:'PbCl2',count:1},{formula:'NaNO3',count:2}] },
      words:[{t:'Lead nitrate reacts with sodium chloride. A white precipitate forms. Identify the products.',v:'products'}],
      distractors:['PbCl','PbCl3','NaNO2','Pb(NO2)2','Na2Cl'] },
    { id:75, type:'double_displacement', difficulty:2,
      equation:{ reactants:[{formula:'BaCl2',count:1},{formula:'K2CO3',count:1}], products:[{formula:'BaCO3',count:1},{formula:'KCl',count:2}] },
      words:[{t:'Barium chloride reacts with potassium carbonate. A white precipitate forms. What are the products?',v:'products'}],
      distractors:['BaSO4','K2SO4','BaO','BaCO2','KClO3'] },
    { id:76, type:'double_displacement', difficulty:3,
      equation:{ reactants:[{formula:'AlCl3',count:1},{formula:'NaOH',count:3}], products:[{formula:'Al(OH)3',count:1},{formula:'NaCl',count:3}] },
      words:[{t:'Aluminium chloride reacts with sodium hydroxide. A white gelatinous precipitate forms. Identify the products.',v:'products'}],
      distractors:['AlO','Al2O3','NaAlO2','AlCl','Na3Al'] },
    { id:77, type:'double_displacement', difficulty:3,
      equation:{ reactants:[{formula:'Na2SO3',count:1},{formula:'HCl',count:2}], products:[{formula:'NaCl',count:2},{formula:'H2O',count:1},{formula:'SO2',count:1}] },
      words:[{t:'Sodium sulfite reacts with hydrochloric acid. A pungent gas evolves. Identify all products.',v:'products'}],
      distractors:['Na2S','SO3','H2S','Na2SO4','Cl2'] },
    { id:78, type:'double_displacement', difficulty:3,
      equation:{ reactants:[{formula:'CaCl2',count:1},{formula:'Na2CO3',count:1}], products:[{formula:'CaCO3',count:1},{formula:'NaCl',count:2}] },
      words:[{t:'Calcium chloride is added to sodium carbonate. A white precipitate forms. What are the products?',v:'products'}],
      distractors:['CaO','Ca(OH)2','CaCO2','Na2O','CaCl'] },

    // NEUTRALIZATION (45-52 + new)
    { id:45, type:'neutralization', difficulty:1,
      equation:{ reactants:[{formula:'HCl',count:1},{formula:'NaOH',count:1}], products:[{formula:'NaCl',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Hydrochloric acid is neutralized by sodium hydroxide. What is formed?',v:'products'}],
      distractors:['NaOCl','Cl2','NaH','NaOH','HClO'] },
    { id:46, type:'neutralization', difficulty:1,
      equation:{ reactants:[{formula:'H2SO4',count:1},{formula:'NaOH',count:2}], products:[{formula:'Na2SO4',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Sulfuric acid reacts with sodium hydroxide. What are the products?',v:'products'}],
      distractors:['NaHSO4','Na2SO3','NaO','H2','Na2S'] },
    { id:47, type:'neutralization', difficulty:1,
      equation:{ reactants:[{formula:'HNO3',count:1},{formula:'KOH',count:1}], products:[{formula:'KNO3',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Nitric acid is neutralized by potassium hydroxide. What salt is formed?',v:'products'}],
      distractors:['KNO2','K2O','KOH','HNO2','K2NO3'] },
    { id:48, type:'neutralization', difficulty:2,
      equation:{ reactants:[{formula:'HCl',count:2},{formula:'Ca(OH)2',count:1}], products:[{formula:'CaCl2',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Hydrochloric acid reacts with calcium hydroxide. What are the products?',v:'products'}],
      distractors:['CaCl','CaOCl2','Ca(ClO)2','CaH2','CaClO3'] },
    { id:49, type:'neutralization', difficulty:2,
      equation:{ reactants:[{formula:'H2SO4',count:1},{formula:'Ca(OH)2',count:1}], products:[{formula:'CaSO4',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Sulfuric acid reacts with calcium hydroxide (slaked lime). What is formed?',v:'products'}],
      distractors:['CaSO3','CaHSO4','CaO','CaS','Ca2SO4'] },
    { id:50, type:'neutralization', difficulty:1,
      equation:{ reactants:[{formula:'HCl',count:1},{formula:'NH4OH',count:1}], products:[{formula:'NH4Cl',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Hydrochloric acid reacts with ammonium hydroxide. What salt is produced?',v:'products'}],
      distractors:['NH4ClO','NH2Cl','N2','NH3','NH4ClO3'] },
    { id:51, type:'neutralization', difficulty:2,
      equation:{ reactants:[{formula:'H2SO4',count:1},{formula:'NH4OH',count:2}], products:[{formula:'(NH4)2SO4',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Sulfuric acid reacts with ammonium hydroxide. What salt is formed?',v:'products'}],
      distractors:['NH4HSO4','NH4SO4','(NH4)2SO3','NH4SO3','(NH4)2S'] },
    { id:52, type:'neutralization', difficulty:1,
      equation:{ reactants:[{formula:'HNO3',count:1},{formula:'NaOH',count:1}], products:[{formula:'NaNO3',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Nitric acid reacts with sodium hydroxide. What is the salt formed?',v:'products'}],
      distractors:['NaNO2','Na2O','Na3N','NaNH2','Na2NO3'] },
    { id:79, type:'neutralization', difficulty:3,
      equation:{ reactants:[{formula:'H2SO4',count:1},{formula:'Mg(OH)2',count:1}], products:[{formula:'MgSO4',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Sulfuric acid reacts with magnesium hydroxide (milk of magnesia). What are the products?',v:'products'}],
      distractors:['Mg(HSO4)2','Mg2SO4','MgO','MgSO3','H2SO3'] },
    { id:80, type:'neutralization', difficulty:3,
      equation:{ reactants:[{formula:'HNO3',count:2},{formula:'Ca(OH)2',count:1}], products:[{formula:'Ca(NO3)2',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Nitric acid reacts with calcium hydroxide. What salt and water are formed?',v:'products'}],
      distractors:['Ca(NO2)2','CaO','Ca3N2','CaNO3','Ca(NO3)'] },
    { id:81, type:'neutralization', difficulty:3,
      equation:{ reactants:[{formula:'H3PO4',count:1},{formula:'NaOH',count:3}], products:[{formula:'Na3PO4',count:1},{formula:'H2O',count:3}] },
      words:[{t:'Phosphoric acid is neutralized by sodium hydroxide. What salt is formed?',v:'products'}],
      distractors:['Na2HPO4','NaH2PO4','NaPO4','Na3PO3','Na3P'] },
    { id:82, type:'neutralization', difficulty:3,
      equation:{ reactants:[{formula:'CH3COOH',count:1},{formula:'NaOH',count:1}], products:[{formula:'CH3COONa',count:1},{formula:'H2O',count:1}] },
      words:[{t:'Acetic acid (vinegar) is neutralized by sodium hydroxide. What salt is formed?',v:'products'}],
      distractors:['CH3COONa2','Na2CO3','C2H5OH','CH3OH','NaHCO3'] },

    // COMBUSTION (53-56 + new)
    { id:53, type:'combustion', difficulty:1,
      equation:{ reactants:[{formula:'CH4',count:1},{formula:'O2',count:2}], products:[{formula:'CO2',count:1},{formula:'H2O',count:2}] },
      words:[{t:'Methane burns in excess oxygen. What are the products of complete combustion?',v:'products'}],
      distractors:['CO','C','H2','CH3OH','C2H2'] },
    { id:54, type:'combustion', difficulty:2,
      equation:{ reactants:[{formula:'C2H6',count:2},{formula:'O2',count:7}], products:[{formula:'CO2',count:4},{formula:'H2O',count:6}] },
      words:[{t:'Ethane undergoes complete combustion. Identify the products.',v:'products'}],
      distractors:['CO','C2H4','C2H5OH','CH4','H2'] },
    { id:55, type:'combustion', difficulty:2,
      equation:{ reactants:[{formula:'C2H5OH',count:1},{formula:'O2',count:3}], products:[{formula:'CO2',count:2},{formula:'H2O',count:3}] },
      words:[{t:'Ethanol (alcohol) burns in air. What are the combustion products?',v:'products'}],
      distractors:['CO','C2H4','CH3CHO','C2H2','H2'] },
    { id:56, type:'combustion', difficulty:1,
      equation:{ reactants:[{formula:'Mg',count:2},{formula:'O2',count:1}], products:[{formula:'MgO',count:2}] },
      words:[{t:'Magnesium ribbon burns in air with a dazzling white flame. What is the product?',v:'products'}],
      distractors:['Mg(OH)2','MgCO3','Mg2O','MgO2','Mg3N2'] },
    { id:83, type:'combustion', difficulty:2,
      equation:{ reactants:[{formula:'C3H8',count:1},{formula:'O2',count:5}], products:[{formula:'CO2',count:3},{formula:'H2O',count:4}] },
      words:[{t:'Propane (LPG) burns in excess oxygen. What are the products of complete combustion?',v:'products'}],
      distractors:['CO','C3H6','C2H4','CH4','CO'] },
    { id:84, type:'combustion', difficulty:3,
      equation:{ reactants:[{formula:'C2H2',count:2},{formula:'O2',count:5}], products:[{formula:'CO2',count:4},{formula:'H2O',count:2}] },
      words:[{t:'Acetylene (ethyne) burns in oxygen with a sooty flame. What are the complete combustion products?',v:'products'}],
      distractors:['CO','C2H4','C2H6','CH4','C'] },
    { id:85, type:'combustion', difficulty:3,
      equation:{ reactants:[{formula:'C6H12O6',count:1},{formula:'O2',count:6}], products:[{formula:'CO2',count:6},{formula:'H2O',count:6}] },
      words:[{t:'Glucose undergoes complete combustion (cellular respiration). What are the products?',v:'products'}],
      distractors:['C2H5OH','CO','C6H12O5','CH4','C2H4O2'] },

    // PRECIPITATION (57-60 + new)
    { id:57, type:'precipitation', difficulty:1,
      equation:{ reactants:[{formula:'AgNO3',count:1},{formula:'KCl',count:1}], products:[{formula:'AgCl',count:1},{formula:'KNO3',count:1}] },
      words:[{t:'Silver nitrate is added to potassium chloride. A white precipitate forms. What is the insoluble product?',v:'products'}],
      distractors:['Ag2O','KClO3','AgNO2','AgOH','Ag2Cl2'] },
    { id:58, type:'precipitation', difficulty:2,
      equation:{ reactants:[{formula:'FeCl3',count:1},{formula:'NH4OH',count:3}], products:[{formula:'Fe(OH)3',count:1},{formula:'NH4Cl',count:3}] },
      words:[{t:'Ferric chloride reacts with ammonium hydroxide. A reddish-brown precipitate forms. Identify the products.',v:'products'}],
      distractors:['Fe(OH)2','Fe2O3','NH4ClO3','FeCl2','Fe2(OH)3'] },
    { id:59, type:'precipitation', difficulty:2,
      equation:{ reactants:[{formula:'CuSO4',count:1},{formula:'H2S',count:1}], products:[{formula:'CuS',count:1},{formula:'H2SO4',count:1}] },
      words:[{t:'Hydrogen sulfide gas is passed through copper sulfate solution. A black precipitate forms. What are the products?',v:'products'}],
      distractors:['Cu2S','CuO','H2SO3','S','Cu2O'] },
    { id:60, type:'precipitation', difficulty:2,
      equation:{ reactants:[{formula:'BaCl2',count:1},{formula:'K2SO4',count:1}], products:[{formula:'BaSO4',count:1},{formula:'KCl',count:2}] },
      words:[{t:'Barium chloride reacts with potassium sulfate. A white precipitate insoluble in acid forms. Identify the products.',v:'products'}],
      distractors:['BaSO3','K2SO3','BaCl','Ba2SO4','KCl2'] },
    { id:86, type:'precipitation', difficulty:2,
      equation:{ reactants:[{formula:'Pb(NO3)2',count:1},{formula:'K2CrO4',count:1}], products:[{formula:'PbCrO4',count:1},{formula:'KNO3',count:2}] },
      words:[{t:'Lead nitrate reacts with potassium chromate. A yellow precipitate forms. Identify the products.',v:'products'}],
      distractors:['PbCr2O7','PbO2','Cr2O3','K2Cr2O7','Pb(NO3)'] },
    { id:87, type:'precipitation', difficulty:3,
      equation:{ reactants:[{formula:'AgNO3',count:2},{formula:'Na2CrO4',count:1}], products:[{formula:'Ag2CrO4',count:1},{formula:'NaNO3',count:2}] },
      words:[{t:'Silver nitrate is added to sodium chromate. A brick-red precipitate forms. Identify the products.',v:'products'}],
      distractors:['Ag2O','Ag2Cr2O7','AgCl','NaAgO','Na2Cr2O7'] },
    { id:88, type:'precipitation', difficulty:3,
      equation:{ reactants:[{formula:'FeCl3',count:1},{formula:'KSCN',count:3}], products:[{formula:'Fe(SCN)3',count:1},{formula:'KCl',count:3}] },
      words:[{t:'Ferric chloride reacts with potassium thiocyanate. A blood-red coloration forms. Identify the products.',v:'products'}],
      distractors:['Fe(SCN)2','Fe2(SCN)3','FeCl2','KSCN2','Fe2S3'] },
    { id:89, type:'precipitation', difficulty:3,
      equation:{ reactants:[{formula:'CaCl2',count:1},{formula:'(NH4)2C2O4',count:1}], products:[{formula:'CaC2O4',count:1},{formula:'NH4Cl',count:2}] },
      words:[{t:'Calcium chloride reacts with ammonium oxalate. A white precipitate of calcium oxalate forms. Identify the products.',v:'products'}],
      distractors:['CaCO3','CaSO4','Ca(OH)2','CaO','NH4ClO4'] },
  ];

  /* ---- HELPERS ---- */
  function getCompoundsForLevel(level) {
    return generateCompounds().filter(c => c.level <= level);
  }

  function getReactionsForDifficulty(maxDiff) {
    return REACTIONS.filter(r => r.difficulty <= maxDiff);
  }

  function getIonsForLevel(level) {
    return IONS.filter(ion => ion.level <= level);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return {
    IONS, getIon, generateCompounds, getCompoundsForLevel,
    REACTIONS, getReactionsForDifficulty, getIonsForLevel, shuffle
  };
})();