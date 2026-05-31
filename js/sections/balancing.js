/* === SECTION 4: BALANCING EQUATIONS === */
window.ChemBalancing = (function() {

  let currentReaction = null;
  let answered = false;
  let questionStartTime = 0;
  let sessionRunning = false;
  let state = null;
  let showAtomCounts = true;

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('balancing-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚖️</div>
          <p style="font-weight:600;color:var(--text);margin-bottom:4px">Balancing Equations</p>
          <p>Balance chemical equations by entering the correct coefficients.<br>Atom count visualization included.</p>
          <button id="balancing-start" class="btn btn-primary btn-block" style="max-width:200px">Start Practice</button>
          <div class="score-row" style="margin-top:16px">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak} streak</span>
          </div>
        </div>
      `;
      document.getElementById('balancing-start')?.addEventListener('click', startSession);
      updateLevelBadge();
      return;
    }
    renderQuestion(el);
  }

  function updateLevelBadge() {
    let badge = document.getElementById('balancing-level');
    if (badge) badge.textContent = showAtomCounts ? 'Visual' : 'Advanced';
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
  }

  // Parse a formula string to get element counts (for atom visualization)
  function getElementCounts(formula, coefficient) {
    let parsed = ChemParser.parseFormula(formula);
    if (!parsed) return {};
    let result = {};
    for (let el in parsed) {
      result[el] = parsed[el] * (coefficient || 1);
    }
    return result;
  }

  function getTotalCounts(formulaList) {
    let total = {};
    formulaList.forEach(f => {
      let counts = getElementCounts(f.formula, f.coeff);
      for (let el in counts) {
        total[el] = (total[el] || 0) + counts[el];
      }
    });
    return total;
  }

  function renderQuestion(el) {
    if (!currentReaction) return;

    let eq = currentReaction.equation;

    // Get current coefficient values from the inputs
    let getCurrentCoeffs = () => {
      let coeffs = {};
      document.querySelectorAll('.balance-coeff').forEach(inp => {
        coeffs[inp.dataset.idx] = parseInt(inp.value) || 1;
      });
      return coeffs;
    };

    let renderEquation = () => {
      let coeffs = getCurrentCoeffs();

      let renderSide = (items, type, startIdx) => {
        return items.map((item, i) => {
          let idx = startIdx + i;
          let val = coeffs[idx] || 1;
          return `
            <span>
              <input type="number" class="balance-coeff" data-idx="${idx}" value="${val}" min="1" max="9" ${answered ? 'disabled' : ''}>
              <span class="balance-formula">${item.formula}</span>
            </span>
          `;
        }).join('<span class="balance-plus"> + </span>');
      };

      let totalItems = eq.reactants.length + eq.products.length;

      // Build atom counts
      if (showAtomCounts) {
        let allElements = new Set();
        let reactantCounts = {};
        let productCounts = {};

        eq.reactants.forEach((r, i) => {
          let coeff = coeffs[i] || 1;
          let counts = getElementCounts(r.formula, coeff);
          for (let el in counts) {
            allElements.add(el);
            reactantCounts[el] = (reactantCounts[el] || 0) + counts[el];
          }
        });
        eq.products.forEach((p, i) => {
          let coeff = coeffs[eq.reactants.length + i] || 1;
          let counts = getElementCounts(p.formula, coeff);
          for (let el in counts) {
            allElements.add(el);
            productCounts[el] = (productCounts[el] || 0) + counts[el];
          }
        });

        let atomBars = Array.from(allElements).map(el => {
          let rVal = reactantCounts[el] || 0;
          let pVal = productCounts[el] || 0;
          let maxVal = Math.max(rVal, pVal, 1);
          let balanced = rVal === pVal;
          return `
            <div class="atom-bar">
              <span class="atom-label">${el}</span>
              <div class="atom-track">
                <div class="atom-fill lhs" style="width:${(rVal / maxVal) * 50}%;left:0"></div>
                <div class="atom-fill rhs" style="width:${(pVal / maxVal) * 50}%;right:0"></div>
              </div>
              <span class="atom-values ${balanced ? 'balanced' : 'unbalanced'}">${rVal} : ${pVal}</span>
            </div>
          `;
        }).join('');

        return `
          <div class="balance-equation">
            <div class="balance-row">
              ${renderSide(eq.reactants, 'reactant', 0)}
              <span class="balance-arrow">→</span>
              ${renderSide(eq.products, 'product', eq.reactants.length)}
            </div>
            <div class="atom-counts" id="atom-counts">
              ${atomBars}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="balance-equation">
            <div class="balance-row">
              ${renderSide(eq.reactants, 'reactant', 0)}
              <span class="balance-arrow">→</span>
              ${renderSide(eq.products, 'product', eq.reactants.length)}
            </div>
          </div>
        `;
      }
    };

    el.innerHTML = `
      <div class="question-card" style="padding:12px">
        <div class="question-prompt" style="font-size:0.9rem">Balance this equation by entering the correct coefficients:</div>
        <div id="balance-equation-area">
          ${renderEquation()}
        </div>
        <div id="balancing-feedback" class="feedback"></div>
      </div>
      <div class="score-row">
        <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
        <span>🔥 ${state.currentStreak}</span>
      </div>
      <div class="action-bar">
        <button id="balancing-check" class="btn btn-primary" ${answered ? 'disabled' : ''}>Check</button>
        <button id="balancing-toggle-visual" class="btn btn-secondary btn-sm">${showAtomCounts ? 'Hide' : 'Show'} Visual</button>
        <button id="balancing-skip" class="btn btn-secondary">Skip</button>
        <button id="balancing-stop" class="btn btn-danger">Stop</button>
      </div>
    `;

    setupListeners();
    questionStartTime = Date.now();
  }

  function setupListeners() {
    // Auto-render atom counts on coefficient change
    document.querySelectorAll('.balance-coeff').forEach(inp => {
      inp.addEventListener('input', function() {
        if (answered) return;
        let val = parseInt(this.value) || 1;
        val = Math.max(1, Math.min(9, val));
        this.value = val;
        // Re-render the equation area with updated counts
        renderEquationArea();
      });
    });

    document.getElementById('balancing-check')?.addEventListener('click', checkAnswer);
    document.getElementById('balancing-toggle-visual')?.addEventListener('click', toggleVisual);
    document.getElementById('balancing-skip')?.addEventListener('click', skipQuestion);
    document.getElementById('balancing-stop')?.addEventListener('click', stopSession);
  }

  function renderEquationArea() {
    if (answered) return;
    let eq = currentReaction.equation;
    let atomCountsEl = document.getElementById('atom-counts');
    if (!atomCountsEl) return;

    let coeffs = {};
    document.querySelectorAll('.balance-coeff').forEach(inp => {
      coeffs[inp.dataset.idx] = parseInt(inp.value) || 1;
    });

    if (!showAtomCounts) {
      atomCountsEl.innerHTML = '';
      return;
    }

    let allElements = new Set();
    let reactantCounts = {};
    let productCounts = {};

    eq.reactants.forEach((r, i) => {
      let coeff = coeffs[i] || 1;
      let counts = getElementCounts(r.formula, coeff);
      for (let el in counts) { allElements.add(el); reactantCounts[el] = (reactantCounts[el]||0) + counts[el]; }
    });
    eq.products.forEach((p, i) => {
      let coeff = coeffs[eq.reactants.length + i] || 1;
      let counts = getElementCounts(p.formula, coeff);
      for (let el in counts) { allElements.add(el); productCounts[el] = (productCounts[el]||0) + counts[el]; }
    });

    let atomBars = Array.from(allElements).map(el => {
      let rVal = reactantCounts[el] || 0;
      let pVal = productCounts[el] || 0;
      let maxVal = Math.max(rVal, pVal, 1);
      let balanced = rVal === pVal;
      return `
        <div class="atom-bar">
          <span class="atom-label">${el}</span>
          <div class="atom-track">
            <div class="atom-fill lhs" style="width:${(rVal/maxVal)*50}%;left:0"></div>
            <div class="atom-fill rhs" style="width:${(pVal/maxVal)*50}%;right:0"></div>
          </div>
          <span class="atom-values ${balanced?'balanced':'unbalanced'}">${rVal} : ${pVal}</span>
        </div>
      `;
    }).join('');

    atomCountsEl.innerHTML = atomBars;
  }

  function checkAnswer() {
    if (answered) return;
    answered = true;
    let time = Date.now() - questionStartTime;
    let eq = currentReaction.equation;

    let correct = true;
    let coeffs = {};
    document.querySelectorAll('.balance-coeff').forEach(inp => {
      coeffs[parseInt(inp.dataset.idx)] = parseInt(inp.value) || 1;
    });

    // Check each coefficient
    eq.reactants.forEach((r, i) => {
      if (coeffs[i] !== r.count) correct = false;
    });
    eq.products.forEach((p, i) => {
      if (coeffs[eq.reactants.length + i] !== p.count) correct = false;
    });

    // Highlight correct/wrong
    document.querySelectorAll('.balance-coeff').forEach(inp => {
      let idx = parseInt(inp.dataset.idx);
      let expected;
      if (idx < eq.reactants.length) expected = eq.reactants[idx].count;
      else expected = eq.products[idx - eq.reactants.length].count;
      let val = parseInt(inp.value) || 1;
      if (val === expected) inp.classList.add('correct');
      else inp.classList.add('wrong');
    });

    let fb = document.getElementById('balancing-feedback');
    fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
    if (correct) {
      fb.innerHTML = '✅ Correct! The equation is balanced.';
    } else {
      let expectedParts = [];
      eq.reactants.forEach(r => expectedParts.push((r.count > 1 ? r.count : '') + r.formula));
      let expectedStr = expectedParts.join(' + ') + ' → ';
      expectedParts = [];
      eq.products.forEach(p => expectedParts.push((p.count > 1 ? p.count : '') + p.formula));
      expectedStr += expectedParts.join(' + ');
      fb.innerHTML = '❌ Not balanced.<br><span class="answer-reveal">Expected: ' + expectedStr + '</span>';
    }

    state = ChemEngine.recordAnswer(state, currentReaction.id, correct, time, 'balancing');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 1000 : 2500);
  }

  function toggleVisual() {
    showAtomCounts = !showAtomCounts;
    render();
  }

  function skipQuestion() {
    if (answered) return;
    answered = true;
    let fb = document.getElementById('balancing-feedback');
    fb.className = 'feedback show wrong';
    let eq = currentReaction.equation;
    let rParts = eq.reactants.map(r => (r.count > 1 ? r.count : '') + r.formula);
    let pParts = eq.products.map(p => (p.count > 1 ? p.count : '') + p.formula);
    fb.innerHTML = '⏭️ Skipped.<br><span class="answer-reveal">Expected: ' + rParts.join(' + ') + ' → ' + pParts.join(' + ') + '</span>';

    state = ChemEngine.recordAnswer(state, currentReaction.id, false, 0, 'balancing');

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, 2000);
  }

  function startSession() {
    sessionRunning = true;
    state = ChemEngine.load();
    showAtomCounts = true;
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    render();
  }

  return { init, render };
})();
