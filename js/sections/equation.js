/* === SECTION 3: EQUATION WRITING (Token UI) === */
window.ChemEquation = (function() {

  let currentReaction = null;
  let currentMode = 'products'; // 'products' or 'full'
  let answered = false;
  let questionStartTime = 0;
  let sessionRunning = false;
  let state = null;
  let slots = []; // { formula: string|null, index: number, type: 'reactant'|'product' }
  let tokenBank = [];
  let usedTokens = {};

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('equation-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚡</div>
          <p style="font-weight:600;color:var(--text);margin-bottom:4px">Equation Writing</p>
          <p>Build chemical equations by tapping formula tokens.<br>From simple to complex word problems.</p>
          <button id="equation-start" class="btn btn-primary btn-block" style="max-width:200px">Start Practice</button>
          <div class="score-row" style="margin-top:16px">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak} streak</span>
          </div>
        </div>
      `;
      document.getElementById('equation-start')?.addEventListener('click', startSession);
      updateLevelBadge();
      return;
    }
    renderQuestion(el);
  }

  function updateLevelBadge() {
    let badge = document.getElementById('equation-level');
    if (badge) badge.textContent = currentReaction ? 'Level ' + currentReaction.difficulty : 'Level 1';
  }

  function getAvailableReactions() {
    return ChemData.getReactionsForDifficulty(3);
  }

  function generateQuestion() {
    let available = getAvailableReactions();
    if (available.length === 0) return;

    currentReaction = ChemEngine.selectNext(state, available);
    if (!currentReaction) currentReaction = available[Math.floor(Math.random() * available.length)];

    answered = false;
    currentMode = Math.random() > 0.4 ? 'products' : 'full';
    usedTokens = {};

    let eq = currentReaction.equation;
    let allFormulas = [];
    let distractorPool = currentReaction.distractors || [];

    if (currentMode === 'products') {
      // Fill in products only, show reactants
      slots = [];
      eq.reactants.forEach(r => {
        let idx = slots.length;
        slots.push({ formula: r.formula, filled: true, index: idx, type: 'reactant', coeff: r.count });
        allFormulas.push(r.formula);
      });
      // Pre-filled reactant slots are locked (not clearable)
      slots.forEach(s => s.locked = true);
      // Empty slots for products
      eq.products.forEach((p, i) => {
        let idx = slots.length;
        slots.push({ formula: null, filled: false, locked: false, index: idx, type: 'product', coeff: 1, expectedFormula: p.formula, expectedCoeff: p.count });
      });
    } else {
      // All slots empty
      slots = [];
      eq.reactants.forEach(r => {
        let idx = slots.length;
        slots.push({ formula: null, filled: false, locked: false, index: idx, type: 'reactant', coeff: 1, expectedFormula: r.formula, expectedCoeff: r.count });
      });
      eq.products.forEach(p => {
        let idx = slots.length;
        slots.push({ formula: null, filled: false, locked: false, index: idx, type: 'product', coeff: 1, expectedFormula: p.formula, expectedCoeff: p.count });
      });
    }

    // Build token bank
    let correctFormulas = [];
    eq.reactants.forEach(r => correctFormulas.push(r.formula));
    eq.products.forEach(p => correctFormulas.push(p.formula));

    // Pick distractors from the reaction's distractor list
    let distractors = distractorPool.filter(d => !correctFormulas.includes(d));
    ChemData.shuffle(distractors);
    distractors = distractors.slice(0, 4);
    // Also add some common ones if not enough
    let fallbacks = ['H2O','CO2','NaCl','HCl','NaOH','O2','H2','Cl2','NH3','CaCO3']
      .filter(f => !correctFormulas.includes(f) && !distractors.includes(f));
    while (distractors.length < 3 && fallbacks.length > 0) {
      distractors.push(fallbacks.shift());
    }

    let allTokens = [...correctFormulas, ...distractors];
    ChemData.shuffle(allTokens);
    tokenBank = allTokens.map(f => ({ formula: f, used: false }));
  }

  function renderQuestion(el) {
    if (!currentReaction) return;
    updateLevelBadge();

    let word = currentReaction.words[Math.floor(Math.random() * currentReaction.words.length)];
    let eq = currentReaction.equation;
    let totalSlots = slots.length;
    let rCount = eq.reactants.length;
    let pCount = eq.products.length;

    // Build equation row HTML
    let makeSlot = (s, i) => {
      let displayFormula = s.filled ? s.formula : '___';
      let isFilled = s.filled;
      return `
        <div class="slot-group">
          <div class="slot ${isFilled ? 'filled' : ''} ${s.wrong ? 'wrong' : ''} ${s.correct ? 'correct' : ''}" data-slot="${i}">
            ${displayFormula}
          </div>
          <input type="number" class="coeff-input" data-slot="${i}" value="${s.coeff}" min="1" max="9" ${answered ? 'disabled' : ''}>
        </div>
      `;
    };

    let reactantSlots = slots.filter(s => s.type === 'reactant').map((s, i) => makeSlot(s, s.index)).join('<span class="equation-plus"> + </span>');
    let productSlots = slots.filter(s => s.type === 'product').map((s, i) => makeSlot(s, s.index)).join('<span class="equation-plus"> + </span>');

    el.innerHTML = `
      <div class="question-card">
        <div class="question-prompt" style="font-size:0.9rem">${word.t || word.text}</div>
        <div class="equation-builder">
          <div class="equation-row">
            <span>${reactantSlots}</span>
            <span class="equation-arrow">→</span>
            <span>${productSlots}</span>
          </div>
        </div>
      </div>

      <div class="token-section">
        <h3>Tap a token to fill the next empty slot</h3>
        <div class="token-bank" id="equation-tokens">
          ${tokenBank.map((t, i) =>
            `<button class="token-chip ${t.used ? 'used' : ''}" data-token="${i}">${t.formula}</button>`
          ).join('')}
        </div>
      </div>

      <div id="equation-feedback" class="feedback"></div>

      <div class="score-row">
        <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
        <span>🔥 ${state.currentStreak}</span>
      </div>
      <div class="action-bar">
        <button id="equation-check" class="btn btn-primary" ${answered ? 'disabled' : ''}>Check</button>
        <button id="equation-skip" class="btn btn-secondary">Skip</button>
        <button id="equation-stop" class="btn btn-danger">Stop</button>
      </div>
    `;

    setupListeners();
    questionStartTime = Date.now();
  }

  function setupListeners() {
    // Tap slot to clear it (only if not locked)
    document.querySelectorAll('.slot.filled').forEach(slot => {
      slot.addEventListener('click', function() {
        if (answered) return;
        let idx = parseInt(this.dataset.slot);
        if (slots[idx].locked) return; // can't clear locked slots
        let prevFormula = slots[idx].formula;
        if (prevFormula) {
          let tokenIdx = tokenBank.findIndex(t => t.formula === prevFormula && t.used);
          if (tokenIdx >= 0) {
            tokenBank[tokenIdx].used = false;
          }
          slots[idx].formula = null;
          slots[idx].filled = false;
          render();
        }
      });
    });

    // Tap token to fill next empty slot
    document.querySelectorAll('.token-chip:not(.used)').forEach(chip => {
      chip.addEventListener('click', function() {
        if (answered) return;
        let tokenIdx = parseInt(this.dataset.token);
        let token = tokenBank[tokenIdx];
        if (token.used) return;

        // Find next empty slot
        let emptySlot = slots.find(s => !s.filled && s.formula === null);
        if (!emptySlot) return;

        emptySlot.formula = token.formula;
        emptySlot.filled = true;
        token.used = true;
        render();
      });
    });

    // Coefficient inputs
    document.querySelectorAll('.coeff-input').forEach(inp => {
      inp.addEventListener('change', function() {
        let idx = parseInt(this.dataset.slot);
        let val = parseInt(this.value) || 1;
        val = Math.max(1, Math.min(9, val));
        slots[idx].coeff = val;
        this.value = val;
      });
    });

    document.getElementById('equation-check')?.addEventListener('click', checkAnswer);
    document.getElementById('equation-skip')?.addEventListener('click', skipQuestion);
    document.getElementById('equation-stop')?.addEventListener('click', stopSession);
  }

  function checkAnswer() {
    if (answered) return;
    // Check all slots are filled
    let emptySlots = slots.filter(s => s.type !== 'reactant' || currentMode === 'full').filter(s => !s.filled);
    if (emptySlots.length > 0) {
      let fb = document.getElementById('equation-feedback');
      fb.className = 'feedback show wrong';
      fb.textContent = '⚠️ Fill in all empty slots first!';
      return;
    }

    answered = true;
    let time = Date.now() - questionStartTime;
    let correct = true;

    // Check each fillable slot (formula correctness only, not coefficients)
    slots.forEach(s => {
      let expectedFormula;
      if (s.type === 'reactant') {
        let idx = slots.filter(x => x.type === 'reactant').indexOf(s);
        expectedFormula = currentReaction.equation.reactants[idx]?.formula;
      } else {
        let idx = slots.filter(x => x.type === 'product').indexOf(s);
        expectedFormula = currentReaction.equation.products[idx]?.formula;
      }

      let formulaCorrect = s.filled && ChemParser.normalizeCase(s.formula) === ChemParser.normalizeCase(expectedFormula);

      if (!formulaCorrect) {
        correct = false;
        s.wrong = true;
      } else {
        s.correct = true;
      }
    });

    // Show feedback
    let fb = document.getElementById('equation-feedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');

    if (correct) {
      fb.innerHTML = '✅ Correct!';
    } else {
      let expected = buildEquationString();
      fb.innerHTML = '❌ Not quite.<br><span class="answer-reveal">Expected: ' + expected + '</span>';
    }

    state = ChemEngine.recordAnswer(state, currentReaction.id, correct, time, 'equation');

    // Re-render with correct/wrong indicators
    let slotEls = document.querySelectorAll('.slot');
    slots.forEach((s, i) => {
      if (slotEls[i]) {
        if (s.correct) slotEls[i].classList.add('correct');
        if (s.wrong) slotEls[i].classList.add('wrong');
      }
    });

    // Disable further interaction
    document.querySelectorAll('.token-chip, .coeff-input, .slot').forEach(el => el.style.pointerEvents = 'none');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 1000 : 2500);
  }

  function buildEquationString() {
    let eq = currentReaction.equation;
    let rParts = eq.reactants.map(r => (r.count > 1 ? r.count : '') + r.formula);
    let pParts = eq.products.map(p => (p.count > 1 ? p.count : '') + p.formula);
    return rParts.join(' + ') + ' → ' + pParts.join(' + ');
  }

  function skipQuestion() {
    if (answered) return;
    answered = true;
    let fb = document.getElementById('equation-feedback');
    fb.className = 'feedback show wrong';
    fb.innerHTML = '⏭️ Skipped.<br><span class="answer-reveal">Expected: ' + buildEquationString() + '</span>';

    state = ChemEngine.recordAnswer(state, currentReaction.id, false, 0, 'equation');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, 2000);
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
