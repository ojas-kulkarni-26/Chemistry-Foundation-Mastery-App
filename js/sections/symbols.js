/* === SECTION 5: SYMBOLS & NAMES === */
window.ChemSymbols = (function() {

  const ELEMENTS = [
    { name:'Hydrogen', symbol:'H' }, { name:'Helium', symbol:'He' },
    { name:'Lithium', symbol:'Li' }, { name:'Beryllium', symbol:'Be' },
    { name:'Boron', symbol:'B' }, { name:'Carbon', symbol:'C' },
    { name:'Nitrogen', symbol:'N' }, { name:'Oxygen', symbol:'O' },
    { name:'Fluorine', symbol:'F' }, { name:'Neon', symbol:'Ne' },
    { name:'Sodium', symbol:'Na' }, { name:'Magnesium', symbol:'Mg' },
    { name:'Aluminium', symbol:'Al' }, { name:'Silicon', symbol:'Si' },
    { name:'Phosphorus', symbol:'P' }, { name:'Sulfur', symbol:'S' },
    { name:'Chlorine', symbol:'Cl' }, { name:'Argon', symbol:'Ar' },
    { name:'Potassium', symbol:'K' }, { name:'Calcium', symbol:'Ca' },
    { name:'Scandium', symbol:'Sc' }, { name:'Titanium', symbol:'Ti' },
    { name:'Vanadium', symbol:'V' }, { name:'Chromium', symbol:'Cr' },
    { name:'Manganese', symbol:'Mn' }, { name:'Iron', symbol:'Fe' },
    { name:'Cobalt', symbol:'Co' }, { name:'Nickel', symbol:'Ni' },
    { name:'Copper', symbol:'Cu' }, { name:'Zinc', symbol:'Zn' },
    { name:'Bromine', symbol:'Br' }, { name:'Krypton', symbol:'Kr' },
    { name:'Rubidium', symbol:'Rb' }, { name:'Strontium', symbol:'Sr' },
    { name:'Silver', symbol:'Ag' }, { name:'Tin', symbol:'Sn' },
    { name:'Antimony', symbol:'Sb' }, { name:'Iodine', symbol:'I' },
    { name:'Caesium', symbol:'Cs' }, { name:'Barium', symbol:'Ba' },
    { name:'Platinum', symbol:'Pt' }, { name:'Gold', symbol:'Au' },
    { name:'Mercury', symbol:'Hg' }, { name:'Lead', symbol:'Pb' },
    { name:'Bismuth', symbol:'Bi' }, { name:'Radium', symbol:'Ra' },
    { name:'Uranium', symbol:'U' }, { name:'Tungsten', symbol:'W' },
    { name:'Arsenic', symbol:'As' }, { name:'Palladium', symbol:'Pd' },
  ];

  let currentItem = null;
  let currentDirection = null;
  let options = [];
  let correctIndex = -1;
  let answered = false;
  let sessionRunning = false;
  let questionStartTime = 0;
  let state = null;

  function getPool() {
    let ions = ChemData.IONS.map(ion => ({
      name: ion.name + (ion.charge > 0 ? ' (' + ion.symbol + (ion.charge > 0 ? '+' : '') + ')' : ''),
      symbol: ion.symbol,
      id: ion.id
    }));
    return [...ELEMENTS, ...ions];
  }

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('symbols-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">🔤</div>
          <p style="font-weight:600;color:var(--text);margin-bottom:4px">Symbols &amp; Names</p>
          <p>Match the names of elements and ions to their symbols and vice versa.</p>
          <button id="symbols-start" class="btn btn-primary btn-block" style="max-width:200px">Start Practice</button>
          <div class="score-row" style="margin-top:16px">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak} streak</span>
          </div>
        </div>
      `;
      document.getElementById('symbols-start')?.addEventListener('click', startSession);
      return;
    }
    renderQuestion(el);
  }

  function generateFakeSymbols(sym, count) {
    let fakes = [];
    let numRegex = /\d+/g;
    let match;
    while ((match = numRegex.exec(sym)) !== null) {
      let num = parseInt(match[0]);
      let idx = match.index;
      for (let delta of [-2, -1, 1, 2]) {
        let newNum = Math.max(1, num + delta);
        if (newNum === num) continue;
        let fake = sym.slice(0, idx) + newNum + sym.slice(idx + match[0].length);
        if (fake !== sym && !fakes.includes(fake)) fakes.push(fake);
      }
    }
    ChemData.shuffle(fakes);
    return fakes.slice(0, count);
  }

  function generateQuestion() {
    let pool = getPool();
    if (pool.length === 0) return;

    let shuffled = [...pool];
    ChemData.shuffle(shuffled);
    currentItem = shuffled[0];
    answered = false;
    currentDirection = Math.random() > 0.5 ? 'name_to_symbol' : 'symbol_to_name';

    let correctAnswer = currentDirection === 'name_to_symbol' ? currentItem.symbol : currentItem.name;
    let first = currentItem.symbol[0];
    let wrongOptions = [];

    if (currentDirection === 'name_to_symbol') {
      // For name→symbol: generate visually similar fake symbols
      let fakes = generateFakeSymbols(currentItem.symbol, 3);
      wrongOptions = fakes;
    }

    // Fallback: same-first-letter real distractors from pool
    while (wrongOptions.length < 3) {
      let candidates = pool.filter(p => {
        if (p.id === currentItem.id) return false;
        let val = currentDirection === 'name_to_symbol' ? p.symbol : p.name;
        if (val === correctAnswer || wrongOptions.includes(val)) return false;
        return currentDirection === 'name_to_symbol' ? p.symbol[0] === first : p.name[0] === currentItem.name[0];
      });
      if (candidates.length === 0) break;
      let pick = candidates[Math.floor(Math.random() * candidates.length)];
      wrongOptions.push(currentDirection === 'name_to_symbol' ? pick.symbol : pick.name);
    }

    // Last-resort fallback: any random from pool
    while (wrongOptions.length < 3) {
      let fallback = pool.filter(p => {
        let val = currentDirection === 'name_to_symbol' ? p.symbol : p.name;
        return val !== correctAnswer && !wrongOptions.includes(val);
      });
      if (fallback.length === 0) break;
      let pick = fallback[Math.floor(Math.random() * fallback.length)];
      wrongOptions.push(currentDirection === 'name_to_symbol' ? pick.symbol : pick.name);
    }

    let allOptions = [correctAnswer, ...wrongOptions];
    ChemData.shuffle(allOptions);
    options = allOptions;
    correctIndex = options.indexOf(correctAnswer);
  }

  function renderQuestion(el) {
    if (!currentItem || answered) return;

    let prompt;
    if (currentDirection === 'name_to_symbol') {
      prompt = `What is the symbol of <span class="highlight">${currentItem.name}</span>?`;
    } else {
      prompt = `Which element or ion has the symbol <span class="highlight">${currentItem.symbol}</span>?`;
    }

    el.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">${prompt}</div>
        <div class="options-grid" id="symbols-options">
          ${options.map((opt, i) =>
            `<button class="option-btn" data-index="${i}">${opt}</button>`
          ).join('')}
        </div>
        <div id="symbols-feedback" class="feedback"></div>
      </div>
      <div class="score-row">
        <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
        <span>🔥 ${state.currentStreak}</span>
      </div>
      <div class="action-bar">
        <button id="symbols-stop" class="btn btn-danger">Stop Session</button>
      </div>
    `;

    document.querySelectorAll('#symbols-options .option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (answered) return;
        answerQuestion(parseInt(this.dataset.index));
      });
    });
    document.getElementById('symbols-stop')?.addEventListener('click', stopSession);

    questionStartTime = Date.now();
  }

  function answerQuestion(index) {
    if (answered) return;
    answered = true;
    let time = Date.now() - questionStartTime;
    let correct = index === correctIndex;

    document.querySelectorAll('#symbols-options .option-btn').forEach(btn => btn.disabled = true);
    document.querySelectorAll('#symbols-options .option-btn').forEach((btn, i) => {
      if (i === correctIndex) btn.classList.add('correct');
      else if (i === index && !correct) btn.classList.add('wrong');
    });

    let fb = document.getElementById('symbols-feedback');
    if (fb) {
      fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
      fb.innerHTML = correct
        ? '✅ Correct!'
        : '❌ Incorrect! <span class="answer-reveal">' + currentItem.name + ' → ' + currentItem.symbol + '</span>';
    }

    state = ChemEngine.recordAnswer(state, currentItem.id || currentItem.symbol, correct, time, 'symbols');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 1500);
  }

  function startSession() {
    sessionRunning = true;
    state = ChemEngine.load();
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    render();
  }

  return { init, render };
})();