window.ChemFormulas = (function() {

  const FORMULAS = [
    {
      id: 'mole',
      name: 'Mole Concept',
      icon: '🔢',
      formula: 'n = m / M',
      desc: 'Number of moles = Mass / Molar mass',
      variables: [
        { sym: 'n', name: 'Number of moles', unit: 'mol' },
        { sym: 'm', name: 'Mass of substance', unit: 'g' },
        { sym: 'M', name: 'Molar mass', unit: 'g/mol' },
      ],
      calc: { find: 'n', inputs: ['m', 'M'] },
      example: '12 g of carbon (M=12 g/mol) \u2192 n = 12/12 = 1 mol'
    },
    {
      id: 'molarity',
      name: 'Molarity',
      icon: '🧪',
      formula: 'C = n / V',
      desc: 'Concentration = Moles of solute / Volume of solution (in liters)',
      variables: [
        { sym: 'C', name: 'Concentration (Molarity)', unit: 'mol/L' },
        { sym: 'n', name: 'Moles of solute', unit: 'mol' },
        { sym: 'V', name: 'Volume of solution', unit: 'L' },
      ],
      calc: { find: 'C', inputs: ['n', 'V'] },
      example: '0.5 mol NaCl in 0.25 L water \u2192 C = 0.5/0.25 = 2.0 M'
    },
    {
      id: 'dilution',
      name: 'Dilution',
      icon: '💧',
      formula: 'C1V1 = C2V2',
      desc: 'Initial concentration \u00d7 Initial volume = Final concentration \u00d7 Final volume',
      variables: [
        { sym: 'C1', name: 'Initial concentration', unit: 'mol/L' },
        { sym: 'V1', name: 'Initial volume', unit: 'L' },
        { sym: 'C2', name: 'Final concentration', unit: 'mol/L' },
        { sym: 'V2', name: 'Final volume', unit: 'L' },
      ],
      calc: { find: 'V1', inputs: ['C2', 'V2', 'C1'] },
      example: 'Dilute 6 M HCl to 1 M in 0.5 L \u2192 V1 = (1\u00d70.5)/6 = 0.083 L'
    },
    {
      id: 'ideal-gas',
      name: 'Ideal Gas Law',
      icon: '💨',
      formula: 'PV = nRT',
      desc: 'Pressure \u00d7 Volume = Moles \u00d7 Gas constant \u00d7 Temperature (in Kelvin)',
      variables: [
        { sym: 'P', name: 'Pressure', unit: 'atm' },
        { sym: 'V', name: 'Volume', unit: 'L' },
        { sym: 'n', name: 'Moles', unit: 'mol' },
        { sym: 'R', name: 'Gas constant', unit: '0.0821 L\u00b7atm/mol\u00b7K' },
        { sym: 'T', name: 'Temperature', unit: 'K' },
      ],
      calc: { find: 'V', inputs: ['n', 'T', 'P'] },
      example: '1 mol gas at 273 K, 1 atm \u2192 V = (1\u00d70.0821\u00d7273)/1 = 22.4 L'
    },
    {
      id: 'ph',
      name: 'pH Scale',
      icon: '🔴',
      formula: 'pH = -log[H+]',
      desc: 'pH = negative logarithm (base 10) of hydrogen ion concentration',
      variables: [
        { sym: 'pH', name: 'pH value', unit: '' },
        { sym: 'H', name: 'Hydrogen ion concentration [H+]', unit: 'mol/L' },
      ],
      calc: { find: 'pH', inputs: ['H'] },
      example: '[H+] = 1\u00d710\u207b\u00b3 M \u2192 pH = -log(10\u207b\u00b3) = 3.0'
    },
    {
      id: 'density',
      name: 'Density',
      icon: '📦',
      formula: 'd = m / V',
      desc: 'Density = Mass / Volume',
      variables: [
        { sym: 'd', name: 'Density', unit: 'g/mL or g/cm\u00b3' },
        { sym: 'm', name: 'Mass', unit: 'g' },
        { sym: 'V', name: 'Volume', unit: 'mL or cm\u00b3' },
      ],
      calc: { find: 'd', inputs: ['m', 'V'] },
      example: '10 g of liquid in 8 mL \u2192 d = 10/8 = 1.25 g/mL'
    },
    {
      id: 'percent-comp',
      name: 'Percent Composition',
      icon: '📊',
      formula: '% = (me / M) \u00d7 100',
      desc: 'Mass percentage of an element in a compound',
      variables: [
        { sym: 'pct', name: 'Percentage of element', unit: '%' },
        { sym: 'me', name: 'Mass of element in compound', unit: 'g' },
        { sym: 'M', name: 'Total mass of compound', unit: 'g' },
      ],
      calc: { find: 'pct', inputs: ['me', 'M'] },
      example: 'H in H2O: (2/18)\u00d7100 = 11.1%'
    },
    {
      id: 'yield',
      name: 'Percentage Yield',
      icon: '🎯',
      formula: '% yield = (actual / theoretical) \u00d7 100',
      desc: 'Actual yield divided by theoretical yield, expressed as percentage',
      variables: [
        { sym: 'yield', name: 'Percentage yield', unit: '%' },
        { sym: 'actual', name: 'Actual yield', unit: 'g' },
        { sym: 'theoretical', name: 'Theoretical yield', unit: 'g' },
      ],
      calc: { find: 'yield', inputs: ['actual', 'theoretical'] },
      example: 'Actual 8 g, theoretical 10 g \u2192 (8/10)\u00d7100 = 80%'
    },
    {
      id: 'avogadro',
      name: "Avogadro's Number",
      icon: '🔬',
      formula: 'N = n \u00d7 NA',
      desc: 'Number of particles = Moles \u00d7 Avogadro\'s number (6.022\u00d710\u00b2\u00b3)',
      variables: [
        { sym: 'N', name: 'Number of particles', unit: '' },
        { sym: 'n', name: 'Number of moles', unit: 'mol' },
        { sym: 'NA', name: "Avogadro's constant", unit: '6.022\u00d710\u00b2\u00b3 mol\u207b\u00b9' },
      ],
      calc: { find: 'N', inputs: ['n'] },
      example: '2 mol CO2 \u2192 N = 2 \u00d7 6.022\u00d710\u00b2\u00b3 = 1.204\u00d710\u00b2\u2074 molecules'
    },
    {
      id: 'heat',
      name: 'Heat Transfer',
      icon: '🔥',
      formula: 'q = mc\u0394T',
      desc: 'Heat energy = Mass \u00d7 Specific heat capacity \u00d7 Change in temperature',
      variables: [
        { sym: 'q', name: 'Heat energy', unit: 'J' },
        { sym: 'm', name: 'Mass', unit: 'g' },
        { sym: 'c', name: 'Specific heat capacity', unit: 'J/(g\u00b7\u00b0C)' },
        { sym: 'dT', name: 'Temperature change (\u0394T)', unit: '\u00b0C' },
      ],
      calc: { find: 'q', inputs: ['m', 'c', 'dT'] },
      example: '100 g water (c=4.18), dT=10\u00b0C \u2192 q = 100\u00d74.18\u00d710 = 4180 J'
    },
    {
      id: 'rate',
      name: 'Reaction Rate',
      icon: '⏱️',
      formula: 'Rate = dC / dt',
      desc: 'Rate of reaction = Change in concentration / Change in time',
      variables: [
        { sym: 'rate', name: 'Reaction rate', unit: 'mol/(L\u00b7s)' },
        { sym: 'dC', name: 'Change in concentration (\u0394[C])', unit: 'mol/L' },
        { sym: 'dt', name: 'Time interval (\u0394t)', unit: 's' },
      ],
      calc: { find: 'rate', inputs: ['dC', 'dt'] },
      example: '[C] changes from 2.0 M to 0.5 M in 30 s \u2192 Rate = 1.5/30 = 0.05 M/s'
    },
    {
      id: 'freezing',
      name: 'Freezing Point Depression',
      icon: '❄️',
      formula: 'dTf = i\u00b7Kf\u00b7m',
      desc: 'Freezing point depression = van\'t Hoff factor \u00d7 cryoscopic constant \u00d7 molality',
      variables: [
        { sym: 'dTf', name: 'Freezing point depression (\u0394Tf)', unit: '\u00b0C' },
        { sym: 'i', name: "van't Hoff factor", unit: '' },
        { sym: 'Kf', name: 'Cryoscopic constant', unit: '\u00b0C\u00b7kg/mol' },
        { sym: 'm', name: 'Molality', unit: 'mol/kg' },
      ],
      calc: { find: 'dTf', inputs: ['i', 'Kf', 'm'] },
      example: '1 m NaCl (i=2) in water (Kf=1.86) \u2192 dTf = 2\u00d71.86\u00d71 = 3.72\u00b0C'
    }
  ];

  let activeFormula = null;

  function init() {}

  function render() {
    let el = document.getElementById('chemformulas-content');
    if (!el) return;
    el.innerHTML = buildHTML();
    setupListeners();
  }

  function buildHTML() {
    let html = `
      <div class="formulas-info">
        Tap any formula card to use its built-in calculator
      </div>
      <div class="formulas-grid">
    `;
    FORMULAS.forEach((f, i) => {
      html += `
        <div class="formula-card" data-idx="${i}">
          <div class="formula-card-header">
            <span class="formula-icon">${f.icon}</span>
            <span class="formula-name">${f.name}</span>
          </div>
          <div class="formula-expr">${f.formula}</div>
          <div class="formula-desc">${f.desc}</div>
        </div>
      `;
    });
    html += `</div>`;
    if (activeFormula !== null) {
      html += buildCalcPanel(activeFormula);
    }
    return html;
  }

  function buildCalcPanel(idx) {
    let f = FORMULAS[idx];
    if (!f || !f.calc) return '';
    return `
      <div class="calc-panel" id="calc-panel">
        <div class="calc-header">
          <span>${f.icon} ${f.name} Calculator</span>
          <button class="calc-close" id="calc-close">&times;</button>
        </div>
        <div class="calc-formula-big">${f.formula}</div>
        <div class="calc-desc">${f.desc}</div>
        <div class="calc-inputs">
          ${f.variables.filter(v => f.calc.find !== v.sym).map(v => `
            <div class="calc-field">
              <label>${v.sym} — ${v.name} ${v.unit ? '('+v.unit+')' : ''}</label>
              <input type="number" class="calc-input" data-var="${v.sym}" value="" step="any" placeholder="Enter value">
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-block" id="calc-solve">Solve</button>
        <div class="calc-result" id="calc-result"></div>
        <div class="calc-example">
          <strong>Example:</strong> ${f.example}
        </div>
      </div>
    `;
  }

  function setupListeners() {
    document.querySelectorAll('.formula-card').forEach(card => {
      card.addEventListener('click', function() {
        activeFormula = parseInt(this.dataset.idx);
        render();
        document.getElementById('calc-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.getElementById('calc-close')?.addEventListener('click', function() {
      activeFormula = null;
      render();
    });

    document.getElementById('calc-solve')?.addEventListener('click', function() {
      solveFormula();
    });
  }

  function solveFormula() {
    if (activeFormula === null) return;
    let f = FORMULAS[activeFormula];
    let inputs = document.querySelectorAll('.calc-input');
    let values = {};
    inputs.forEach(inp => {
      let v = parseFloat(inp.value);
      if (!isNaN(v)) values[inp.dataset.var] = v;
    });

    let result;
    let find = f.calc.find;

    switch (f.id) {
      case 'mole':
        if ('m' in values && 'M' in values) result = values.m / values.M;
        break;
      case 'molarity':
        if ('n' in values && 'V' in values) result = values.n / values.V;
        break;
      case 'dilution':
        if ('C2' in values && 'V2' in values && 'C1' in values) result = (values.C2 * values.V2) / values.C1;
        break;
      case 'ideal-gas':
        if ('n' in values && 'T' in values && 'P' in values) result = (values.n * 0.0821 * values.T) / values.P;
        break;
      case 'ph':
        if ('H' in values) result = -Math.log10(values.H);
        break;
      case 'density':
        if ('m' in values && 'V' in values) result = values.m / values.V;
        break;
      case 'percent-comp':
        if ('me' in values && 'M' in values) result = (values.me / values.M) * 100;
        break;
      case 'yield':
        if ('actual' in values && 'theoretical' in values && values.theoretical !== 0)
          result = (values.actual / values.theoretical) * 100;
        break;
      case 'avogadro':
        if ('n' in values) result = values.n * 6.022e23;
        break;
      case 'heat':
        if ('m' in values && 'c' in values && 'dT' in values) result = values.m * values.c * values.dT;
        break;
      case 'rate':
        if ('dC' in values && 'dt' in values && values.dt !== 0) result = values.dC / values.dt;
        break;
      case 'freezing':
        if ('i' in values && 'Kf' in values && 'm' in values) result = values.i * values.Kf * values.m;
        break;
    }

    let resEl = document.getElementById('calc-result');
    if (result !== undefined && isFinite(result)) {
      let fmt = result.toPrecision(4);
      let foundVar = f.variables.find(v => v.sym === find);
      let unitStr = foundVar && foundVar.unit ? ' ' + foundVar.unit : '';
      resEl.innerHTML = `<strong>Result: ${fmt}${unitStr}</strong>`;
      resEl.className = 'calc-result show';
    } else {
      resEl.innerHTML = 'Please enter all required values';
      resEl.className = 'calc-result show error';
    }
  }

  return { init, render };
})();
