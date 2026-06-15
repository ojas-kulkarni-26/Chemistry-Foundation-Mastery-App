/* === SECTION 6: CHEATSHEET === */
window.ChemCheatsheet = (function() {

  const REACTION_TYPES = [
    { type:'Combination (Synthesis)', example:'2Mg + O\u2082 \u2192 2MgO', desc:'Two or more substances combine to form a single product.' },
    { type:'Decomposition', example:'CaCO\u2083 \u2192 CaO + CO\u2082', desc:'A single compound breaks down into two or simpler substances.' },
    { type:'Single Displacement', example:'Zn + CuSO\u2084 \u2192 ZnSO\u2084 + Cu', desc:'A more reactive element displaces a less reactive one.' },
    { type:'Double Displacement', example:'NaCl + AgNO\u2083 \u2192 AgCl\u2193 + NaNO\u2083', desc:'Two compounds exchange ions to form two new compounds.' },
    { type:'Neutralization', example:'HCl + NaOH \u2192 NaCl + H\u2082O', desc:'An acid reacts with a base to form salt and water.' },
    { type:'Combustion', example:'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O', desc:'A substance burns in oxygen, releasing heat and light.' },
    { type:'Precipitation', example:'AgNO\u2083 + KCl \u2192 AgCl\u2193 + KNO\u2083', desc:'Two solutions react to form an insoluble solid (precipitate).' },
  ];

  function init() {
    render();
  }

  function render() {
    let el = document.getElementById('cheatsheet-content');
    if (!el) return;
    el.innerHTML = buildHTML();
    setupAccordion();
  }

  function buildHTML() {
    let ions = ChemData.IONS;
    let mono = ions.filter(i => i.category === 'monoatomic');
    let poly = ions.filter(i => i.category === 'polyatomic');
    let vari = ions.filter(i => i.category === 'variable');

    let elements = getElementTable();
    let monoTable = ionTable(mono);
    let polyTable = ionTable(poly);
    let varTable = variableTable(vari);
    let compTable = compoundsTable();
    let rxns = reactionsBlock();

    return `
      <div style="padding-bottom:8px;font-size:0.8rem;color:var(--text-light);text-align:center">Tap a section to expand. Review before quizzing!</div>
      ${section('Common Elements', elements)}
      ${section('Monoatomic Ions', monoTable)}
      ${section('Polyatomic Ions', polyTable)}
      ${section('Variable Valency Ions', varTable)}
      ${section('Common Compounds', compTable)}
      ${section('Reaction Types', rxns)}
      ${section('Unit Conversions', unitConversionsBlock())}
      ${section('Chemistry Formulas', chemistryFormulasBlock())}
    `;
  }

  function section(title, body) {
    return `
      <div class="cheat-section">
        <div class="cheat-header" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
          <span>${title}</span>
          <span class="cheat-arrow">\u25B6</span>
        </div>
        <div class="cheat-body">${body}</div>
      </div>
    `;
  }

  function getElementTable() {
    let elems = [
      'H','He','Li','Be','B','C','N','O','F','Ne',
      'Na','Mg','Al','Si','P','S','Cl','Ar',
      'K','Ca','Fe','Co','Ni','Cu','Zn','Br','Kr',
      'Ag','Sn','I','Ba','Pt','Au','Hg','Pb','U'
    ];
    let rows = elems.map(s => {
      let name = getElementName(s);
      return `<tr><td class="formula">${s}</td><td>${name}</td></tr>`;
    }).join('');
    return `<table class="cheat-table"><tr><th>Symbol</th><th>Name</th></tr>${rows}</table>`;
  }

  function getElementName(sym) {
    let map = {
      H:'Hydrogen', He:'Helium', Li:'Lithium', Be:'Beryllium', B:'Boron', C:'Carbon',
      N:'Nitrogen', O:'Oxygen', F:'Fluorine', Ne:'Neon', Na:'Sodium', Mg:'Magnesium',
      Al:'Aluminium', Si:'Silicon', P:'Phosphorus', S:'Sulfur', Cl:'Chlorine', Ar:'Argon',
      K:'Potassium', Ca:'Calcium', Fe:'Iron', Co:'Cobalt', Ni:'Nickel', Cu:'Copper',
      Zn:'Zinc', Br:'Bromine', Kr:'Krypton', Ag:'Silver', Sn:'Tin', I:'Iodine',
      Ba:'Barium', Pt:'Platinum', Au:'Gold', Hg:'Mercury', Pb:'Lead', U:'Uranium'
    };
    return map[sym] || sym;
  }

  function chargeStr(c) {
    if (c > 0) return '+' + c;
    return '' + c;
  }

  function chargeClass(c) {
    return c > 0 ? 'pos' : 'neg';
  }

  function ionTable(list) {
    let cats = list.filter(i => i.type === 'cation');
    let ans = list.filter(i => i.type === 'anion');
    function rows(arr) {
      return arr.map(i =>
        `<tr><td>${i.name}</td><td class="formula">${i.symbol}</td><td class="charge ${chargeClass(i.charge)}">${chargeStr(i.charge)}</td></tr>`
      ).join('');
    }
    let html = '';
    if (cats.length) {
      html += `<div style="font-weight:600;font-size:0.8rem;color:var(--primary);margin:8px 0 4px">Cations</div>`;
      html += `<table class="cheat-table"><tr><th>Name</th><th>Symbol</th><th>Charge</th></tr>${rows(cats)}</table>`;
    }
    if (ans.length) {
      html += `<div style="font-weight:600;font-size:0.8rem;color:var(--accent);margin:8px 0 4px">Anions</div>`;
      html += `<table class="cheat-table"><tr><th>Name</th><th>Symbol</th><th>Charge</th></tr>${rows(ans)}</table>`;
    }
    return html;
  }

  function variableTable(list) {
    let rows = list.map(i =>
      `<tr><td>${i.name}${i.altName ? '<br><small style="color:var(--text-light)">' + i.altName + '</small>' : ''}</td><td class="formula">${i.symbol}</td><td class="charge ${chargeClass(i.charge)}">${chargeStr(i.charge)}</td></tr>`
    ).join('');
    return `<table class="cheat-table"><tr><th>Name</th><th>Symbol</th><th>Charge</th></tr>${rows}</table>`;
  }

  function compoundsTable() {
    let compounds = ChemData.generateCompounds();
    // Group by level
    let l1 = compounds.filter(c => c.level <= 1);
    let l2 = compounds.filter(c => c.level === 2);
    let l3 = compounds.filter(c => c.level >= 3);
    function makeTable(arr, label) {
      if (!arr.length) return '';
      return `<div style="font-weight:600;font-size:0.8rem;color:var(--text);margin:8px 0 4px">${label}</div>
        <table class="cheat-table"><tr><th>Name</th><th>Formula</th></tr>
        ${arr.sort((a,b) => a.name.localeCompare(b.name)).slice(0, 40).map(c =>
          `<tr><td>${c.name}</td><td class="formula">${c.formula}</td></tr>`
        ).join('')}</table>`;
    }
    return makeTable(l1, 'Level 1-2 (Monoatomic)')
      + makeTable(l2, 'Level 2 (Polyatomic)')
      + makeTable(l3, 'Level 3 (Variable & Complex)');
  }

  function reactionsBlock() {
    return REACTION_TYPES.map(r =>
      `<div class="cheat-reaction">
        <div class="rxn-type">${r.type}</div>
        <div class="rxn-example">${r.example}</div>
        <div class="rxn-desc">${r.desc}</div>
      </div>`
    ).join('');
  }

  function siPrefixTable() {
    let prefixes = [
      { sym:'Y', name:'yotta', exp:24 },
      { sym:'Z', name:'zetta', exp:21 },
      { sym:'E', name:'exa',   exp:18 },
      { sym:'P', name:'peta',  exp:15 },
      { sym:'T', name:'tera',  exp:12 },
      { sym:'G', name:'giga',  exp:9 },
      { sym:'M', name:'mega',  exp:6 },
      { sym:'k', name:'kilo',  exp:3 },
      { sym:'h', name:'hecto', exp:2 },
      { sym:'da',name:'deca',  exp:1 },
      { sym:'d', name:'deci',  exp:-1 },
      { sym:'c', name:'centi', exp:-2 },
      { sym:'m', name:'milli', exp:-3 },
      { sym:'\u03BC', name:'micro', exp:-6 },
      { sym:'n', name:'nano',  exp:-9 },
      { sym:'p', name:'pico',  exp:-12 },
      { sym:'f', name:'femto', exp:-15 },
      { sym:'a', name:'atto',  exp:-18 },
      { sym:'z', name:'zepto', exp:-21 },
      { sym:'y', name:'yocto', exp:-24 },
    ];
    var SUPER = {'0':'\u2070','1':'\u00B9','2':'\u00B2','3':'\u00B3','4':'\u2074','5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079'};
    function toSuper(n) { return Math.abs(n).toString().split('').map(function(d){return SUPER[d]}).join(''); }
    function powStr(e) {
      if (e === 0) return '10\u00B0';
      if (e > 0) return '10' + toSuper(e);
      return '10\u207b' + toSuper(e);
    }
    let rows = prefixes.map(p =>
      `<tr><td class="formula" style="font-size:0.85rem">${p.sym}</td><td>${p.name}</td><td style="font-family:'Courier New',monospace;text-align:center">${powStr(p.exp)}</td><td style="font-family:'Courier New',monospace">${p.sym}m</td></tr>`
    ).join('');
    return `<table class="cheat-table"><tr><th>Prefix</th><th>Name</th><th>Power</th><th>Example</th></tr>${rows}</table>`;
  }

  function unitConversionsBlock() {
    const CATS = [
      { name:'SI Prefixes (Length)', icon:'📏', html: siPrefixTable() },
      { name:'Mass', icon:'⚖️', conversions:['1 kg = 1000 g', '1 g = 1000 mg', '1 mg = 1000 \u03BCg', '1 kg = 2.205 lb', '1 t = 1000 kg'] },
      { name:'Volume', icon:'\uD83E\uDDEA', conversions:['1 L = 1000 mL', '1 mL = 1 cm\u00B3', '1 L = 1 dm\u00B3', '1 m\u00B3 = 1000 L', '1 dL = 100 mL'] },
      { name:'Temperature', icon:'\uD83C\uDF21\uFE0F', conversions:['\u00B0C = K \u2212 273.15', 'K = \u00B0C + 273.15', '\u00B0F = \u00B0C \u00D7 9/5 + 32', '\u00B0C = (\u00B0F \u2212 32) \u00D7 5/9', '0\u00B0C = 273.15 K = 32\u00B0F'] },
      { name:'Pressure', icon:'\uD83D\uDCA8', conversions:['1 atm = 101.325 kPa', '1 atm = 760 mmHg (torr)', '1 bar = 100 kPa', '1 atm = 1.01325 bar', '1 kPa = 7.501 mmHg', '1 atm = 14.696 psi'] },
      { name:'Energy', icon:'\u26A1', conversions:['1 J = 0.239 cal', '1 cal = 4.184 J', '1 kcal = 4.184 kJ', '1 kWh = 3600 kJ', '1 eV = 1.602\u00D710\u207b\u00B9\u2079 J'] },
      { name:'Amount', icon:'\uD83D\uDD2C', conversions:['1 mol = 1000 mmol', '1 mol = 6.022\u00D710\u00B2\u00B3 particles', '1 kmol = 1000 mol'] },
      { name:'Concentration', icon:'\uD83E\uDDEB', conversions:['1 M = 1000 mM', '1 mM = 1000 \u03BCM', '1% (w/v) = 1 g/100 mL', '1 ppm = 1 mg/L'] },
    ];
    return CATS.map(c => {
      if (c.html) {
        return `<div style="margin-bottom:8px">
          <div style="font-weight:600;font-size:0.8rem;color:var(--primary);margin-bottom:4px">${c.icon} ${c.name}</div>
          ${c.html}
        </div>`;
      }
      return `<div style="margin-bottom:8px">
        <div style="font-weight:600;font-size:0.8rem;color:var(--primary);margin-bottom:4px">${c.icon} ${c.name}</div>
        ${c.conversions.map(conv => `<div style="font-size:0.75rem;padding:2px 0;font-family:'Courier New',monospace;color:var(--text-light)">${conv}</div>`).join('')}
      </div>`;
    }).join('');
  }

  function chemistryFormulasBlock() {
    const FORMULAS = [
      { name:'Mole Concept', formula:'n = m / M', desc:'Moles = Mass / Molar mass' },
      { name:'Molarity', formula:'C = n / V', desc:'Concentration = Moles / Volume (L)' },
      { name:'Dilution', formula:'C₁V₁ = C₂V₂', desc:'Initial × Initial = Final × Final' },
      { name:'Ideal Gas Law', formula:'PV = nRT', desc:'R = 0.0821 L·atm/(mol·K)' },
      { name:'pH', formula:'pH = −log[H⁺]', desc:'Hydrogen ion concentration' },
      { name:'Density', formula:'ρ = m / V', desc:'Density = Mass / Volume' },
      { name:'Avogadro\'s Number', formula:'N = n × Nₐ', desc:'Nₐ = 6.022×10²³' },
      { name:'Heat Transfer', formula:'q = mcΔT', desc:'Heat = Mass × SHC × Temp change' },
      { name:'Percentage Yield', formula:'% = (Actual/Theo) × 100', desc:'Efficiency of reaction' },
      { name:'Reaction Rate', formula:'Rate = Δ[C]/Δt', desc:'Change in concentration / time' },
      { name:'Freezing Point Depression', formula:'ΔTf = i·Kf·m', desc:'Colligative property' },
      { name:'Percent Composition', formula:'% = (mₑ/M) × 100', desc:'Element mass / total mass' },
    ];
    return FORMULAS.map(f => `
      <div style="margin-bottom:6px;padding:6px 8px;background:var(--bg);border-radius:6px">
        <div style="font-weight:600;font-size:0.8rem;color:var(--text)">${f.name}</div>
        <div style="font-family:'Courier New',monospace;font-size:0.85rem;color:var(--primary);margin:2px 0">${f.formula}</div>
        <div style="font-size:0.7rem;color:var(--text-light)">${f.desc}</div>
      </div>
    `).join('');
  }

  function setupAccordion() {
    // Open first section by default
    let first = document.querySelector('.cheat-header');
    if (first) {
      first.classList.add('open');
      first.nextElementSibling.classList.add('open');
    }
  }

  return { init, render };
})();