/* === SECTION 1: VALENCY MASTERY === */
window.ChemValency = (function() {

  let currentIon = null;
  let currentDirection = null; // 'ion_to_valency' or 'valency_to_ion'
  let options = [];
  let correctIndex = -1;
  let answered = false;
  let questionStartTime = 0;
  let active = false;
  let state = null;
  let level = 1;
  let sessionRunning = false;
  let consecutiveLevelCorrect = 0;

  function init() {
    state = ChemEngine.load();
    render();
  }

  function render() {
    let el = document.getElementById('valency-content');
    if (!el) return;
    el.innerHTML = '';
    if (!sessionRunning) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚛️</div>
          <p style="font-weight:600;color:var(--text);margin-bottom:4px">Valency Mastery</p>
          <p>Master the valencies of common ions.<br>Level ${level}: ${getLevelName(level)}</p>
          <button id="valency-start" class="btn btn-primary btn-block" style="max-width:200px">Start Quiz</button>
          <div class="score-row" style="margin-top:16px">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak} streak</span>
          </div>
        </div>
      `;
      document.getElementById('valency-start')?.addEventListener('click', startSession);
      updateLevelBadge();
      return;
    }
    renderQuestion(el);
  }

  function getLevelName(lvl) {
    switch(lvl) {
      case 1: return 'Monoatomic Ions';
      case 2: return 'Polyatomic Ions';
      case 3: return 'Variable Valency';
      default: return 'Mastered!';
    }
  }

  function updateLevelBadge() {
    let badge = document.getElementById('valency-level');
    if (badge) badge.textContent = getLevelName(level);
  }

  function getAvailableIons() {
    let all = ChemData.getIonsForLevel(level);
    // Only include unique symbol+charge combos for level 1 and 2
    if (level <= 2) return all;
    return all; // For level 3, include variable valency
  }

  function generateQuestion() {
    let available = getAvailableIons();
    if (available.length === 0) return;

    // Use engine to pick which ion to test
    currentIon = ChemEngine.selectNext(state, available);
    if (!currentIon) currentIon = available[Math.floor(Math.random() * available.length)];

    currentDirection = Math.random() > 0.5 ? 'ion_to_valency' : 'valency_to_ion';
    answered = false;

    // Generate options
    let correctAnswer = currentIon.charge;
    let wrongPool = available.filter(ion => ion.id !== currentIon.id && ion.charge !== correctAnswer);
    ChemData.shuffle(wrongPool);

    let wrongOptions = wrongPool.slice(0, 3);
    // If not enough wrong options, generate some fake ones
    while (wrongOptions.length < 3) {
      let fakeCharge;
      do {
        fakeCharge = Math.floor(Math.random() * 7) - 3;
      } while (fakeCharge === 0 || fakeCharge === correctAnswer || wrongOptions.some(o => o.charge === fakeCharge));
      wrongOptions.push({ charge: fakeCharge, name: '?', symbol: '?', id: 'fake' });
    }

    options = [currentIon, ...wrongOptions];
    ChemData.shuffle(options);
    correctIndex = options.indexOf(currentIon);
  }

  function renderQuestion(el) {
    if (!currentIon || answered) return;

    let prompt;
    if (currentDirection === 'ion_to_valency') {
      let displayName = getIonDisplayName(currentIon);
      prompt = `What is the valency of <span class="highlight">${displayName}</span>?<br><small style="color:var(--text-light);font-size:0.8rem">(${currentIon.symbol})</small>`;
    } else {
      let chargeStr = currentIon.charge > 0 ? '+' + currentIon.charge : currentIon.charge;
      prompt = `Which ion has valency <span class="highlight">${chargeStr}</span>?`;
    }

    el.innerHTML = `
      <div class="question-card">
        <div class="question-prompt">${prompt}</div>
        <div class="options-grid" id="valency-options">
          ${options.map((opt, i) => {
            let label = currentDirection === 'ion_to_valency'
              ? (opt.charge > 0 ? '+' + opt.charge : opt.charge)
              : getIonDisplayName(opt) + ' (' + opt.symbol + ')';
            return `<button class="option-btn" data-index="${i}">${label}</button>`;
          }).join('')}
        </div>
        <div id="valency-feedback" class="feedback"></div>
      </div>
      <div class="score-row">
        <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
        <span>🔥 ${state.currentStreak}</span>
        <span>Lv${level}</span>
      </div>
      <div class="action-bar">
        <button id="valency-stop" class="btn btn-danger">Stop Session</button>
      </div>
    `;

    // Add event listeners
    document.querySelectorAll('#valency-options .option-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (answered) return;
        answerQuestion(parseInt(this.dataset.index));
      });
    });
    document.getElementById('valency-stop')?.addEventListener('click', stopSession);

    questionStartTime = Date.now();
  }

  function getIonDisplayName(ion) {
    if (ion.category === 'variable' && ion.altName && Math.random() > 0.5) {
      return ion.altName + ' [' + ion.name + ']';
    }
    return ion.name;
  }

  function getIonDisplayNameStatic(ion, useAlt) {
    if (ion.category === 'variable' && ion.altName && useAlt) {
      return ion.altName + ' [' + ion.name + ']';
    }
    return ion.name;
  }

  function answerQuestion(index) {
    if (answered) return;
    answered = true;
    let time = Date.now() - questionStartTime;
    let correct = index === correctIndex;

    // Disable all buttons
    document.querySelectorAll('#valency-options .option-btn').forEach(btn => btn.disabled = true);

    // Highlight correct/wrong
    document.querySelectorAll('#valency-options .option-btn').forEach((btn, i) => {
      if (i === correctIndex) btn.classList.add('correct');
      else if (i === index && !correct) btn.classList.add('wrong');
    });

    // Show feedback
    let fb = document.getElementById('valency-feedback');
    if (fb) {
      let chargeStr = currentIon.charge > 0 ? '+' + currentIon.charge : currentIon.charge;
      fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
      fb.innerHTML = correct
        ? '✅ Correct! <span class="answer-reveal">' + getIonDisplayNameStatic(currentIon, false) + ' has valency ' + chargeStr + '</span>'
        : '❌ Incorrect! <span class="answer-reveal">' + getIonDisplayNameStatic(currentIon, false) + ' has valency ' + chargeStr + '</span>';
    }

    // Record in engine
    state = ChemEngine.recordAnswer(state, currentIon.id, correct, time, 'valency');

    // Track consecutive correct for level advancement
    if (correct) {
      consecutiveLevelCorrect++;
    } else {
      consecutiveLevelCorrect = 0;
    }

    // Auto-advance to next question after delay
    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 1500);
  }

  function startSession() {
    sessionRunning = true;
    state = ChemEngine.load();
    consecutiveLevelCorrect = 0;
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    // Check if should advance level
    checkLevelAdvance();
    render();
  }

  function checkLevelAdvance() {
    if (level >= 3) return;
    // Need 80%+ accuracy on current level to advance
    let levelIons = ChemData.getIonsForLevel(level);
    if (levelIons.length === 0) return;
    let correct = 0, total = 0;
    levelIons.forEach(ion => {
      let item = state.items[ion.id];
      if (item && item.totalAttempts >= 2) {
        total++;
        if (item.mastery >= 60) correct++;
      }
    });
    if (total >= 5 && (correct / total) >= 0.7) {
      level++;
      updateLevelBadge();
    }
  }

  return { init, render };
})();
