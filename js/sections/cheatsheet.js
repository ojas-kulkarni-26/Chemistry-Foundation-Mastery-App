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