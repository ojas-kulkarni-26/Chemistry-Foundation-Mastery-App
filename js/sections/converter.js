window.ChemConverter = (function() {

  const CATEGORIES = [
    { id: 'length',  name: 'Length',          icon: '\uD83D\uDCCF' },
    { id: 'mass',    name: 'Mass',            icon: '\u2696\uFE0F' },
    { id: 'volume',  name: 'Volume',          icon: '\uD83E\uDDEA' },
    { id: 'temp',    name: 'Temperature',     icon: '\uD83C\uDF21\uFE0F' },
    { id: 'pressure',name: 'Pressure',        icon: '\uD83D\uDCA8' },
    { id: 'energy',  name: 'Energy',          icon: '\u26A1' },
    { id: 'amount',  name: 'Amount',          icon: '\uD83D\uDD2C' },
    { id: 'conc',    name: 'Concentration',   icon: '\uD83E\uDDEB' },
  ];

  /* SI Prefixes: name, symbol, power of 10 */
  const SI_PREFIXES = [
    { sym:'Y', name:'yotta', exp:24 },
    { sym:'Z', name:'zetta', exp:21 },
    { sym:'E', name:'exa',   exp:18 },
    { sym:'P', name:'peta',  exp:15 },
    { sym:'T', name:'tera',  exp:12 },
    { sym:'G', name:'giga',  exp:9  },
    { sym:'M', name:'mega',  exp:6  },
    { sym:'k', name:'kilo',  exp:3  },
    { sym:'h', name:'hecto', exp:2  },
    { sym:'da',name:'deca',  exp:1  },
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

  function labelFor(p) { return p.sym + 'm'; }
  function fullName(p) { return p.name + 'meter (' + p.sym + 'm)'; }
  const SUPER = {'0':'\u2070','1':'\u00B9','2':'\u00B2','3':'\u00B3','4':'\u2074','5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079'};
  function toSuper(n) { return Math.abs(n).toString().split('').map(d => SUPER[d]).join(''); }
  function powerStr(e) {
    if (e === 0) return '1';
    if (e === 1) return '10';
    if (e === -1) return '0.1';
    if (e < 0) return '10\u207b' + toSuper(e);
    return '10' + toSuper(e);
  }

  function generateLengthItems() {
    let items = [];
    // adjacent pairs
    for (let i = 0; i < SI_PREFIXES.length - 1; i++) {
      let a = SI_PREFIXES[i], b = SI_PREFIXES[i+1];
      let diff = a.exp - b.exp;
      let factor = Math.pow(10, diff);
      items.push({
        cat: 'length',
        from: { id: a.sym, label: a.sym + 'm' },
        to: { id: b.sym, label: b.sym + 'm' },
        factor: factor,
        desc: '1 ' + a.sym + 'm = ' + powerStr(diff) + ' ' + b.sym + 'm'
      });
      // reverse
      items.push({
        cat: 'length',
        from: { id: b.sym, label: b.sym + 'm' },
        to: { id: a.sym, label: a.sym + 'm' },
        factor: 1 / factor,
        desc: '1 ' + b.sym + 'm = 10\u207b' + Math.abs(diff) + ' ' + a.sym + 'm'
      });
    }
    // skip-one pairs for variety (e.g. km to cm, mm to nm)
    for (let i = 0; i < SI_PREFIXES.length - 2; i++) {
      let a = SI_PREFIXES[i], b = SI_PREFIXES[i+2];
      let diff = a.exp - b.exp;
      let factor = Math.pow(10, diff);
      items.push({
        cat: 'length',
        from: { id: a.sym, label: a.sym + 'm' },
        to: { id: b.sym, label: b.sym + 'm' },
        factor: factor,
        desc: '1 ' + a.sym + 'm = ' + powerStr(diff) + ' ' + b.sym + 'm'
      });
    }
    return items;
  }

  const QUIZ_ITEMS = [].concat(
    generateLengthItems(),
    // Mass
    { cat: 'mass',   from: { id:'g',  label:'g' },         to: { id:'mg', label:'mg' },        factor: 1000,    desc:'1 g = 1000 mg' },
    { cat: 'mass',   from: { id:'g',  label:'g' },         to: { id:'kg', label:'kg' },        factor: 0.001,   desc:'1 g = 0.001 kg' },
    { cat: 'mass',   from: { id:'kg', label:'kg' },        to: { id:'g',  label:'g' },         factor: 1000,    desc:'1 kg = 1000 g' },
    { cat: 'mass',   from: { id:'mg', label:'mg' },        to: { id:'ug', label:'\u03BCg' },   factor: 1000,    desc:'1 mg = 1000 \u03BCg' },
    { cat: 'mass',   from: { id:'kg', label:'kg' },        to: { id:'t',  label:'t' },         factor: 0.001,   desc:'1 kg = 0.001 t' },
    { cat: 'mass',   from: { id:'g',  label:'g' },         to: { id:'lb', label:'lb' },        factor: 0.00220462, desc:'1 g = 0.0022 lb' },
    // Volume
    { cat: 'volume', from: { id:'L',  label:'L' },         to: { id:'mL', label:'mL' },        factor: 1000,    desc:'1 L = 1000 mL' },
    { cat: 'volume', from: { id:'mL', label:'mL' },        to: { id:'L',  label:'L' },         factor: 0.001,   desc:'1 mL = 0.001 L' },
    { cat: 'volume', from: { id:'mL', label:'mL' },        to: { id:'uL', label:'\u03BCL' },   factor: 1000,    desc:'1 mL = 1000 \u03BCL' },
    { cat: 'volume', from: { id:'L',  label:'L' },         to: { id:'dm3',label:'dm\u00B3' },   factor: 1,       desc:'1 L = 1 dm\u00B3' },
    { cat: 'volume', from: { id:'L',  label:'L' },         to: { id:'m3', label:'m\u00B3' },    factor: 0.001,   desc:'1 L = 0.001 m\u00B3' },
    { cat: 'volume', from: { id:'mL', label:'mL' },        to: { id:'cm3',label:'cm\u00B3' },   factor: 1,       desc:'1 mL = 1 cm\u00B3' },
    // Temperature
    { cat: 'temp',   from: { id:'C',  label:'\u00B0C' },   to: { id:'K',  label:'K' },         special:'CtoK',  desc:'\u00B0C + 273.15 = K' },
    { cat: 'temp',   from: { id:'K',  label:'K' },         to: { id:'C',  label:'\u00B0C' },   special:'KtoC',  desc:'K - 273.15 = \u00B0C' },
    { cat: 'temp',   from: { id:'C',  label:'\u00B0C' },   to: { id:'F',  label:'\u00B0F' },   special:'CtoF',  desc:'\u00B0C \u00D7 9/5 + 32 = \u00B0F' },
    { cat: 'temp',   from: { id:'F',  label:'\u00B0F' },   to: { id:'C',  label:'\u00B0C' },   special:'FtoC',  desc:'(\u00B0F - 32) \u00D7 5/9 = \u00B0C' },
    // Pressure
    { cat: 'pressure', from: { id:'atm', label:'atm' },    to: { id:'kPa', label:'kPa' },      factor: 101.325, desc:'1 atm = 101.325 kPa' },
    { cat: 'pressure', from: { id:'atm', label:'atm' },    to: { id:'mmHg',label:'mmHg' },     factor: 760,     desc:'1 atm = 760 mmHg' },
    { cat: 'pressure', from: { id:'atm', label:'atm' },    to: { id:'bar', label:'bar' },      factor: 1.01325, desc:'1 atm = 1.01325 bar' },
    { cat: 'pressure', from: { id:'kPa', label:'kPa' },    to: { id:'atm', label:'atm' },      factor: 0.009869,desc:'1 kPa = 0.00987 atm' },
    { cat: 'pressure', from: { id:'bar', label:'bar' },    to: { id:'kPa', label:'kPa' },      factor: 100,     desc:'1 bar = 100 kPa' },
    { cat: 'pressure', from: { id:'mmHg',label:'mmHg' },   to: { id:'atm', label:'atm' },      factor: 0.001316,desc:'1 mmHg = 0.001316 atm' },
    { cat: 'pressure', from: { id:'kPa', label:'kPa' },    to: { id:'mmHg',label:'mmHg' },     factor: 7.501,   desc:'1 kPa = 7.501 mmHg' },
    // Energy
    { cat: 'energy', from: { id:'J',  label:'J' },         to: { id:'cal', label:'cal' },      factor: 0.239006,desc:'1 J = 0.239 cal' },
    { cat: 'energy', from: { id:'cal', label:'cal' },       to: { id:'J',  label:'J' },         factor: 4.184,   desc:'1 cal = 4.184 J' },
    { cat: 'energy', from: { id:'kJ', label:'kJ' },         to: { id:'kcal',label:'kcal' },     factor: 0.239,   desc:'1 kJ = 0.239 kcal' },
    { cat: 'energy', from: { id:'kcal',label:'kcal' },      to: { id:'kJ', label:'kJ' },        factor: 4.184,   desc:'1 kcal = 4.184 kJ' },
    { cat: 'energy', from: { id:'J',  label:'J' },          to: { id:'kJ', label:'kJ' },        factor: 0.001,   desc:'1 J = 0.001 kJ' },
    // Amount
    { cat: 'amount', from: { id:'mol', label:'mol' },       to: { id:'mmol',label:'mmol' },     factor: 1000,    desc:'1 mol = 1000 mmol' },
    { cat: 'amount', from: { id:'mmol',label:'mmol' },      to: { id:'mol', label:'mol' },      factor: 0.001,   desc:'1 mmol = 0.001 mol' },
    { cat: 'amount', from: { id:'mol', label:'mol' },       to: { id:'kmol',label:'kmol' },     factor: 0.001,   desc:'1 mol = 0.001 kmol' },
    // Concentration
    { cat: 'conc',   from: { id:'M',  label:'M' },          to: { id:'mM', label:'mM' },        factor: 1000,    desc:'1 M = 1000 mM' },
    { cat: 'conc',   from: { id:'mM', label:'mM' },         to: { id:'uM', label:'\u03BCM' },   factor: 1000,    desc:'1 mM = 1000 \u03BCM' },
    { cat: 'conc',   from: { id:'M',  label:'M' },          to: { id:'mM', label:'mM' },        factor: 1000,    desc:'1 M = 1000 mM' },
    { cat: 'conc',   from: { id:'mM', label:'mM' },         to: { id:'M',  label:'M' },         factor: 0.001,   desc:'1 mM = 0.001 M' },
  );

  let currentItem = null;
  let currentValue = 1;
  let options = [];
  let correctIndex = -1;
  let answered = false;
  let questionStartTime = 0;
  let sessionRunning = false;
  let state = null;
  let selectedCat = null;

  let filteredItems = QUIZ_ITEMS;

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('converter-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      renderStart(el);
      return;
    }
    renderQuestion(el);
  }

  function renderStart(el) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">\uD83D\uDCCF</div>
        <p class="empty-title">Unit Conversion Quiz</p>
        <p class="empty-sub">Test your ability to convert between chemistry units</p>
        <div class="conv-cat-select">
          <button class="conv-cat-btn ${selectedCat === null ? 'active' : ''}" data-cat="all">All</button>
          ${CATEGORIES.map(c =>
            `<button class="conv-cat-btn ${selectedCat === c.id ? 'active' : ''}" data-cat="${c.id}">${c.icon} ${c.name}</button>`
          ).join('')}
        </div>
        <button id="conv-start" class="btn btn-primary">Start Quiz</button>
        <div class="score-row">
          <span>\u2713 ${state.totalCorrect}/${state.totalAnswered}</span>
          <span>\uD83D\uDD25 ${state.currentStreak}</span>
        </div>
      </div>
    `;
    document.querySelectorAll('.conv-cat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        let cat = this.dataset.cat;
        selectedCat = cat === 'all' ? null : cat;
        filteredItems = selectedCat ? QUIZ_ITEMS.filter(i => i.cat === selectedCat) : QUIZ_ITEMS;
        render();
      });
    });
    document.getElementById('conv-start')?.addEventListener('click', startSession);
  }

  function startSession() {
    if (filteredItems.length === 0) {
      filteredItems = QUIZ_ITEMS;
      selectedCat = null;
    }
    sessionRunning = true;
    state = ChemEngine.load();
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    render();
  }

  function generateQuestion() {
    if (filteredItems.length === 0) return;
    let idx = Math.floor(Math.random() * filteredItems.length);
    currentItem = filteredItems[idx];

    // Pick a random value between 0.1 and 10,000 (log-uniform)
    let logVal = Math.random() * 5 - 0.5;
    currentValue = Math.round(Math.pow(10, logVal) * 100) / 100;
    if (currentValue === 0) currentValue = 1;
    // Use nice numbers
    let niceVals = [0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    currentValue = niceVals[Math.floor(Math.random() * niceVals.length)];

    answered = false;

    let correctAnswer = computeConversion(currentItem, currentValue);
    let wrongAnswers = generateWrongAnswers(correctAnswer, currentItem);

    options = [correctAnswer, ...wrongAnswers];
    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    correctIndex = options.indexOf(correctAnswer);
  }

  function computeConversion(item, val) {
    if (item.special === 'CtoK') return Math.round((val + 273.15) * 100) / 100;
    if (item.special === 'KtoC') return Math.round((val - 273.15) * 100) / 100;
    if (item.special === 'CtoF') return Math.round((val * 9/5 + 32) * 100) / 100;
    if (item.special === 'FtoC') return Math.round(((val - 32) * 5/9) * 100) / 100;
    let result = val * item.factor;
    // Format to reasonable precision
    if (Math.abs(result) >= 10000 || (Math.abs(result) < 0.001 && result !== 0)) {
      return parseFloat(result.toPrecision(4));
    }
    return Math.round(result * 100000) / 100000;
  }

  function generateWrongAnswers(correct, item) {
    let wrongs = new Set();
    let attempts = 0;
    while (wrongs.size < 3 && attempts < 50) {
      attempts++;
      let wrong;
      let strategy = Math.floor(Math.random() * 5);
      switch (strategy) {
        case 0: wrong = correct * (Math.random() < 0.5 ? 10 : 0.1); break; // off by 10x
        case 1: wrong = correct * (Math.random() < 0.5 ? 1000 : 0.001); break; // off by 1000x
        case 2: wrong = correct + (Math.random() < 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.1) * correct; break; // close but wrong
        case 3: wrong = correct * (Math.random() < 0.5 ? 100 : 0.01); break; // off by 100x
        case 4:
          let otherItem = QUIZ_ITEMS[Math.floor(Math.random() * QUIZ_ITEMS.length)];
          wrong = computeConversion(otherItem, currentValue);
          break;
      }
      if (wrong === undefined || !isFinite(wrong)) wrong = correct * (Math.random() * 5 + 0.5);
      wrong = Math.round(wrong * 1000) / 1000;
      if (wrong !== correct && !wrongs.has(wrong) && wrong > 0) {
        wrongs.add(wrong);
      }
    }
    // Ensure we have 3
    let fallbacks = [correct * 10, correct / 10, correct * 100, correct / 100, correct + 1, correct - 1];
    fallbacks.forEach(fb => {
      if (wrongs.size >= 3) return;
      fb = Math.round(fb * 1000) / 1000;
      if (fb !== correct && !wrongs.has(fb) && fb > 0) wrongs.add(fb);
    });
    return Array.from(wrongs).slice(0, 3);
  }

  function renderQuestion(el) {
    if (!currentItem || answered) return;

    let cat = CATEGORIES.find(c => c.id === currentItem.cat);
    let prompt = `Convert <span class="highlight">${formatNum(currentValue)} ${currentItem.from.label}</span> to <span class="highlight">${currentItem.to.label}</span>`;

    el.innerHTML = `
      <div class="question-card">
        <div class="question-prompt" style="font-size:0.95rem">${prompt}</div>
        <div class="options-grid" id="conv-options">
          ${options.map((opt, i) => {
            let label = formatNum(opt) + ' ' + currentItem.to.label;
            return `<button class="option-btn" data-index="${i}">${label}</button>`;
          }).join('')}
        </div>
        <div id="conv-feedback" class="feedback"></div>
      </div>
      <div class="score-row">
        <span>\u2713 ${state.totalCorrect}/${state.totalAnswered}</span>
        <span>\uD83D\uDD25 ${state.currentStreak}</span>
        <span>${cat ? cat.icon : '\uD83D\uDCCF'} ${cat ? cat.name : ''}</span>
      </div>
      <div class="action-bar">
        <button id="conv-stop" class="btn btn-danger">Stop Session</button>
      </div>
    `;

    document.querySelectorAll('#conv-options .option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (answered) return;
        answerQuestion(parseInt(this.dataset.index));
      });
    });
    document.getElementById('conv-stop')?.addEventListener('click', stopSession);

    questionStartTime = Date.now();
  }

  function answerQuestion(index) {
    if (answered) return;
    answered = true;
    let time = Date.now() - questionStartTime;
    let correct = index === correctIndex;

    document.querySelectorAll('#conv-options .option-btn').forEach(btn => btn.disabled = true);

    document.querySelectorAll('#conv-options .option-btn').forEach((btn, i) => {
      if (i === correctIndex) btn.classList.add('correct');
      else if (i === index && !correct) btn.classList.add('wrong');
    });

    let fb = document.getElementById('conv-feedback');
    if (fb) {
      let correctAnswer = computeConversion(currentItem, currentValue);
      let answerStr = formatNum(correctAnswer) + ' ' + currentItem.to.label;
      fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
      fb.innerHTML = correct
        ? '\u2705 Correct! <span class="answer-reveal">' + formatNum(currentValue) + ' ' + currentItem.from.label + ' = ' + answerStr + '</span>'
        : '\u274C Incorrect! <span class="answer-reveal">' + formatNum(currentValue) + ' ' + currentItem.from.label + ' = ' + answerStr + '</span>';
    }

    let conceptId = 'conv_' + currentItem.cat + '_' + currentItem.from.id + '_' + currentItem.to.id;
    state = ChemEngine.recordAnswer(state, conceptId, correct, time, 'converter');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 1500);
  }

  function formatNum(n) {
    if (!isFinite(n)) return '0';
    if (n >= 10000000) return n.toExponential(3);
    if (n <= 0.0001 && n !== 0) return n.toExponential(3);
    let s = parseFloat(n.toPrecision(5));
    return s.toLocaleString('en-US', { maximumFractionDigits: 4 });
  }

  return { init, render };
})();
