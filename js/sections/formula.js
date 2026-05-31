/* === SECTION 2: FORMULA WRITING === */
window.ChemFormula = (function() {

  let currentCompound = null;
  let currentMode = 'input'; // 'input' or 'mcq'
  let answered = false;
  let questionStartTime = 0;
  let sessionRunning = false;
  let state = null;
  let level = 1;
  let mcqOptions = [];
  let mcqCorrect = -1;
  let questionCount = 0;

  const KEYPAD_KEYS = [
    'H','O','N','Cl','S','P','C','Na','Ca','K','Mg','Fe','Al','Cu','Zn','Ag','Ba','Pb',
    '(', ')', '[', ']'
  ];

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('formula-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">✏️</div>
          <p style="font-weight:600;color:var(--text);margin-bottom:4px">Formula Writing</p>
          <p>Practice writing chemical formulas from names.<br>Level ${level}</p>
          <button id="formula-start" class="btn btn-primary btn-block" style="max-width:200px">Start Practice</button>
          <div class="score-row" style="margin-top:16px">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak} streak</span>
          </div>
        </div>
      `;
      document.getElementById('formula-start')?.addEventListener('click', startSession);
      updateLevelBadge();
      return;
    }
    renderQuestion(el);
  }

  function updateLevelBadge() {
    let badge = document.getElementById('formula-level');
    if (badge) badge.textContent = 'Level ' + level;
  }

  function getAvailableCompounds() {
    return ChemData.getCompoundsForLevel(level);
  }

  function generateQuestion() {
    let available = getAvailableCompounds();
    if (available.length === 0) return;

    currentCompound = ChemEngine.selectNext(state, available);
    if (!currentCompound) currentCompound = available[Math.floor(Math.random() * available.length)];

    answered = false;
    questionCount++;

    // Every 4th question is MCQ, rest are input
    currentMode = (questionCount % 5 === 0) ? 'mcq' : 'input';

    if (currentMode === 'mcq') {
      generateMcqOptions();
    }
  }

  function generateMcqOptions() {
    let available = getAvailableCompounds();
    let wrongPool = available.filter(c => c.id !== currentCompound.id && c.formula !== currentCompound.formula);
    ChemData.shuffle(wrongPool);
    let wrong = wrongPool.slice(0, 3);
    while (wrong.length < 3) {
      // Generate fake formula
      let fake = currentCompound.formula;
      if (fake.length > 2) {
        fake = fake.slice(0, -1) + (parseInt(fake[fake.length-1] || '1') + 1);
      } else {
        fake = fake + '2';
      }
      wrong.push({ formula: fake, name: '?' });
    }
    let all = [{ formula: currentCompound.formula, id: currentCompound.id }, ...wrong];
    ChemData.shuffle(all);
    mcqOptions = all;
    mcqCorrect = all.findIndex(o => o.id === currentCompound.id);
  }

  function renderQuestion(el) {
    if (!currentCompound) return;

    if (currentMode === 'input') {
      el.innerHTML = `
        <div class="question-card">
          <div class="question-prompt">
            Write the formula for:<br>
            <span class="highlight">${currentCompound.name}</span>
          </div>
          <div class="input-group">
            <input type="text" id="formula-input" class="formula-input" placeholder="e.g. Na2SO4" autocomplete="off" autocorrect="off" spellcheck="false">
            <button id="formula-check" class="btn btn-primary">Check</button>
          </div>
          <div id="formula-preview" style="font-size:0.8rem;color:var(--text-light);text-align:center;min-height:20px;font-family:'Courier New',monospace"></div>
          <div id="formula-feedback" class="feedback"></div>
        </div>
        <div class="chem-keypad" id="formula-keypad">
          ${KEYPAD_KEYS.map(k => `<button class="key" data-key="${k}">${k}</button>`).join('')}
          <button class="key action" data-key="backspace">⌫</button>
          <button class="key action" data-key="clear">Clear</button>
        </div>
        <div class="score-row">
          <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
          <span>🔥 ${state.currentStreak}</span>
        </div>
        <div class="action-bar">
          <button id="formula-skip" class="btn btn-secondary">Skip</button>
          <button id="formula-stop" class="btn btn-danger">Stop</button>
        </div>
      `;

      setupInputListeners();
    } else {
      // MCQ mode
      el.innerHTML = `
        <div class="question-card">
          <div class="question-prompt">
            Select the correct formula for:<br>
            <span class="highlight">${currentCompound.name}</span>
          </div>
          <div class="options-grid" id="formula-mcq-options">
            ${mcqOptions.map((opt, i) =>
              `<button class="option-btn" data-index="${i}">${opt.formula}</button>`
            ).join('')}
          </div>
          <div id="formula-feedback" class="feedback"></div>
        </div>
        <div class="score-row">
          <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
          <span>🔥 ${state.currentStreak}</span>
        </div>
        <div class="action-bar">
          <button id="formula-stop" class="btn btn-danger">Stop</button>
        </div>
      `;

      document.querySelectorAll('#formula-mcq-options .option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          if (answered) return;
          answerMcq(parseInt(this.dataset.index));
        });
      });
      document.getElementById('formula-stop')?.addEventListener('click', stopSession);
    }

    questionStartTime = Date.now();
  }

  function setupInputListeners() {
    let input = document.getElementById('formula-input');
    let preview = document.getElementById('formula-preview');
    let checkBtn = document.getElementById('formula-check');
    let skipBtn = document.getElementById('formula-skip');
    let stopBtn = document.getElementById('formula-stop');

    if (input) {
      input.focus();
      input.addEventListener('input', function() {
        if (preview) {
          let val = this.value.trim();
          preview.textContent = val ? '→ ' + val : '';
        }
      });
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') checkAnswer();
      });
    }

    // Keypad buttons
    document.querySelectorAll('#formula-keypad .key').forEach(btn => {
      btn.addEventListener('click', function() {
        if (answered || !input) return;
        let k = this.dataset.key;
        let cursor = input.selectionStart;
        if (cursor === null) cursor = input.value.length;
        if (k === 'backspace') {
          if (cursor > 0) {
            input.value = input.value.slice(0, cursor - 1) + input.value.slice(cursor);
            cursor--;
          }
        } else if (k === 'clear') {
          input.value = '';
          cursor = 0;
        } else {
          input.value = input.value.slice(0, cursor) + k + input.value.slice(cursor);
          cursor += k.length;
        }
        input.setSelectionRange(cursor, cursor);
        input.dispatchEvent(new Event('input'));
        input.focus();
      });
    });

    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (skipBtn) skipBtn.addEventListener('click', skipQuestion);
    if (stopBtn) stopBtn.addEventListener('click', stopSession);
  }

  function checkAnswer() {
    if (answered) return;
    let input = document.getElementById('formula-input');
    if (!input) return;
    let userAnswer = input.value.trim();
    if (!userAnswer) return;

    answered = true;
    let time = Date.now() - questionStartTime;
    let expected = currentCompound.formula;

    let normalized = ChemParser.normalizeCase(userAnswer);
    let correct = normalized === expected;

    // If string match fails, try parsing both and comparing counts
    if (!correct) {
      let parsedUser = ChemParser.parseFormula(normalized);
      let parsedExp = ChemParser.parseFormula(expected);
      if (parsedUser && parsedExp && ChemParser.countsEqual(parsedUser, parsedExp)) {
        // Counts match but order doesn't - give partial credit info
        correct = false; // still counts as wrong for strict mode
      }
    }

    // Show feedback
    let fb = document.getElementById('formula-feedback');
    input.classList.add(correct ? 'correct' : 'wrong');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');

    if (correct) {
      fb.innerHTML = '✅ Correct!';
    } else {
      let breakdown = getFormulaBreakdown();
      let parsedUser = ChemParser.parseFormula(ChemParser.normalizeCase(userAnswer));
      let extra = '';
      if (parsedUser) {
        let elements = Object.entries(parsedUser).map(([el, n]) => el + (n > 1 ? n : '')).join('');
        if (elements !== normalized) extra = '<br><span class="answer-reveal">You entered: ' + elements + '</span>';
      }
      fb.innerHTML = '❌ Incorrect. Expected: <strong>' + expected + '</strong><br><span class="answer-reveal">' + breakdown + '</span>' + extra;
    }

    state = ChemEngine.recordAnswer(state, currentCompound.id, correct, time, 'formula');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 2000);
  }

  function answerMcq(index) {
    if (answered) return;
    answered = true;
    let time = Date.now() - questionStartTime;
    let correct = index === mcqCorrect;

    document.querySelectorAll('#formula-mcq-options .option-btn').forEach(btn => btn.disabled = true);
    document.querySelectorAll('#formula-mcq-options .option-btn').forEach((btn, i) => {
      if (i === mcqCorrect) btn.classList.add('correct');
      else if (i === index && !correct) btn.classList.add('wrong');
    });

    let fb = document.getElementById('formula-feedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = correct
      ? '✅ Correct!'
      : '❌ Incorrect. Expected: <strong>' + currentCompound.formula + '</strong>';

    state = ChemEngine.recordAnswer(state, currentCompound.id, correct, time, 'formula');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 1500);
  }

  function getFormulaBreakdown() {
    let c = currentCompound;
    let catCount = c.cationCount;
    let anCount = c.anionCount;
    let parts = [];
    if (catCount > 1) parts.push(catCount + ' × ' + c.cationSymbol);
    else parts.push(c.cationSymbol);
    if (anCount > 1) {
      let anShow = c.anionSymbol.length > 2 ? '(' + c.anionSymbol + ')' : c.anionSymbol;
      parts.push(anCount + ' × ' + anShow);
    } else parts.push(c.anionSymbol);
    return parts.join(' + ') + ' = ' + c.formula;
  }

  function skipQuestion() {
    if (answered) return;
    answered = true;
    let fb = document.getElementById('formula-feedback');
    fb.className = 'feedback show wrong';
    fb.innerHTML = '⏭️ Skipped. Expected: <strong>' + currentCompound.formula + '</strong>';

    state = ChemEngine.recordAnswer(state, currentCompound.id, false, 0, 'formula');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, 1200);
  }

  function startSession() {
    sessionRunning = true;
    state = ChemEngine.load();
    questionCount = 0;
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    render();
  }

  return { init, render };
})();
