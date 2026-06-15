/* === SECTION 1: VALENCY MASTERY === */
window.ChemValency = (function() {

  let currentIon = null;
  let currentDirection = null;
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
    level = state.valencyLevel || 1;
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
          <p class="empty-title">Valency Mastery</p>
          <p class="empty-sub">Master the valencies of common ions</p>
          <div class="level-selector">
            ${[1,2,3,4].map(l => `
              <button class="level-btn ${l === level ? 'active' : ''}" data-level="${l}">${getLevelName(l)}</button>
            `).join('')}
          </div>
          <button id="valency-start" class="btn btn-primary">Start Quiz</button>
          <div class="score-row">
            <span>✓ ${state.totalCorrect}/${state.totalAnswered}</span>
            <span>🔥 ${state.currentStreak}</span>
          </div>
        </div>
      `;
      document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          let newLevel = parseInt(this.dataset.level);
          if (newLevel !== level) {
            level = newLevel;
            state.valencyLevel = level;
            ChemEngine.save(state);
            render();
          }
        });
      });
      document.getElementById('valency-start')?.addEventListener('click', startSession);
      updateLevelBadge();
      return;
    }
    renderQuestion(el);
  }

  function getLevelName(lvl) {
    switch(lvl) {
      case 1: return 'Monoatomic';
      case 2: return 'Polyatomic';
      case 3: return 'Variable';
      case 4: return 'Mixed';
      default: return 'Mastered!';
    }
  }

  function updateLevelBadge() {
    let badge = document.getElementById('valency-level');
    if (badge) badge.textContent = getLevelName(level);
  }

  function getAvailableIons() {
    if (level >= 4) return ChemData.IONS;
    return ChemData.getIonsForLevel(level);
  }

  function generateQuestion() {
    let available = getAvailableIons();
    if (available.length === 0) return;

    currentIon = ChemEngine.selectNext(state, available);
    if (!currentIon) currentIon = available[Math.floor(Math.random() * available.length)];

    currentDirection = Math.random() > 0.5 ? 'ion_to_valency' : 'valency_to_ion';
    answered = false;

    let correctAnswer = currentIon.charge;
    let wrongPool = available.filter(ion => ion.id !== currentIon.id && ion.charge !== correctAnswer);
    ChemData.shuffle(wrongPool);

    let wrongOptions = wrongPool.slice(0, 3);
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

    document.querySelectorAll('#valency-options .option-btn').forEach(btn => btn.disabled = true);

    document.querySelectorAll('#valency-options .option-btn').forEach((btn, i) => {
      if (i === correctIndex) btn.classList.add('correct');
      else if (i === index && !correct) btn.classList.add('wrong');
    });

    let fb = document.getElementById('valency-feedback');
    if (fb) {
      let chargeStr = currentIon.charge > 0 ? '+' + currentIon.charge : currentIon.charge;
      fb.className = 'feedback show ' + (correct ? 'correct' : 'wrong');
      fb.innerHTML = correct
        ? '✅ Correct! <span class="answer-reveal">' + getIonDisplayNameStatic(currentIon, false) + ' has valency ' + chargeStr + '</span>'
        : '❌ Incorrect! <span class="answer-reveal">' + getIonDisplayNameStatic(currentIon, false) + ' has valency ' + chargeStr + '</span>';
    }

    state = ChemEngine.recordAnswer(state, currentIon.id, correct, time, 'valency');

    if (correct) {
      consecutiveLevelCorrect++;
    } else {
      consecutiveLevelCorrect = 0;
    }

    setTimeout(() => {
      if (!sessionRunning) return;
      generateQuestion();
      render();
    }, correct ? 800 : 1500);
  }

  function startSession() {
    sessionRunning = true;
    state = ChemEngine.load();
    state.valencyLevel = level;
    ChemEngine.save(state);
    consecutiveLevelCorrect = 0;
    generateQuestion();
    render();
  }

  function stopSession() {
    sessionRunning = false;
    checkLevelAdvance();
    state.valencyLevel = level;
    ChemEngine.save(state);
    render();
  }

  function checkLevelAdvance() {
    if (level >= 4) return;
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
    }
  }

  return { init, render };
})();