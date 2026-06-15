(function() {

  let currentSection = 'valency';
  let state = ChemEngine.load();
  let sessionStartTime = Date.now();
  let sessionCount = 0;

  function init() {
    let canvas = document.getElementById('progress-chart');
    if (canvas) ChemChart.init(canvas);

    ChemValency.init();
    ChemFormula.init();
    ChemEquation.init();
    ChemBalancing.init();
    ChemSymbols.init();
    ChemCheatsheet.init();
    ChemConverter.init();
    ChemFormulas.init();

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        let section = this.dataset.section;
        if (section) {
          navigateTo(section);
        } else if (this.id === 'nav-progress') {
          openProgressPanel();
        }
      });
    });

    // Scrollable nav fade indicator
    let navScroll = document.querySelector('.nav-scroll');
    if (navScroll) {
      navScroll.addEventListener('scroll', updateNavFade);
      updateNavFade();
    }

    document.getElementById('progressBtn')?.addEventListener('click', openProgressPanel);
    document.getElementById('close-panel')?.addEventListener('click', closeProgressPanel);
    document.getElementById('panel-overlay')?.addEventListener('click', closeProgressPanel);
    document.getElementById('reset-progress')?.addEventListener('click', resetProgress);

    // Track session start
    sessionStartTime = Date.now();
    sessionCount = parseInt(localStorage.getItem('chemmaster_sessions') || '0');

    navigateTo('valency');
  }

  function updateNavFade() {
    let navScroll = document.querySelector('.nav-scroll');
    let fade = document.getElementById('nav-fade');
    if (!navScroll || !fade) return;
    fade.classList.toggle('show', navScroll.scrollLeft + navScroll.clientWidth < navScroll.scrollWidth - 4);
  }

  function navigateTo(section) {
    currentSection = section;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    document.querySelectorAll('.section').forEach(el => {
      el.classList.remove('active');
    });
    let target = document.getElementById('section-' + section);
    if (target) target.classList.add('active');

    updateStats();

    // Auto-scroll nav item into view
    let activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    switch(section) {
      case 'valency': ChemValency.render(); break;
      case 'formula': ChemFormula.render(); break;
      case 'equation': ChemEquation.render(); break;
      case 'balancing': ChemBalancing.render(); break;
      case 'symbols': ChemSymbols.render(); break;
      case 'cheatsheet': ChemCheatsheet.render(); break;
      case 'converter': ChemConverter.render(); break;
      case 'chemformulas': ChemFormulas.render(); break;
    }
  }

  function openProgressPanel() {
    state = ChemEngine.load();
    updateStats();
    let panel = document.getElementById('progress-panel');
    let overlay = document.getElementById('panel-overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('show');

    let stats = ChemEngine.getStats(state);
    ChemChart.draw(stats.chart);

    // XP Calculation
    let xp = calculateXP(state);
    document.getElementById('stat-xp').textContent = xp;
    document.getElementById('stat-sessions').textContent = sessionCount || 1;

    // Mastered vs needs practice
    let items = Object.entries(state.items);
    let mastered = items.filter(([_, v]) => v.mastery >= 80).length;
    let needsPractice = items.filter(([_, v]) => v.mastery > 0 && v.mastery < 40).length;
    document.getElementById('stat-mastered').textContent = mastered;
    document.getElementById('stat-practice').textContent = needsPractice;

    // Mastery Heatmap
    renderMasteryHeat(state);

    // Smart Recommendations
    renderRecommendations(state);

    // Weak areas
    renderWeakAreas(state);
  }

  function calculateXP(state) {
    let xp = 0;
    Object.values(state.items).forEach(item => {
      xp += Math.round(item.mastery * (item.correctAttempts / Math.max(item.totalAttempts, 1)) * 0.5);
    });
    xp += state.totalCorrect * 10;
    xp += (state.bestStreak || 0) * 5;
    return xp;
  }

  function renderMasteryHeat(state) {
    let el = document.getElementById('mastery-heat');
    if (!el) return;
    let sections = [
      { key:'valency', icon:'⚛️', name:'Valency' },
      { key:'formula', icon:'✏️', name:'Formula' },
      { key:'equation', icon:'⚡', name:'Equation' },
      { key:'balancing', icon:'⚖️', name:'Balance' },
      { key:'symbols', icon:'🔤', name:'Symbols' },
      { key:'converter', icon:'📐', name:'Convert' }
    ];
    let html = '';
    sections.forEach(sec => {
      let filtered = state.history.filter(h => h.section === sec.key);
      let total = filtered.length;
      let correct = filtered.filter(h => h.correct).length;
      let pct = total > 0 ? Math.round(correct / total * 100) : 0;

      // Get concept-level mastery
      let conceptIds = Object.keys(state.items).filter(id => {
        let h = state.history.find(h => h.conceptId === id);
        return h && h.section === sec.key;
      });
      let avgMastery = 0;
      if (conceptIds.length > 0) {
        let sum = conceptIds.reduce((a, id) => a + (state.items[id]?.mastery || 0), 0);
        avgMastery = Math.round(sum / conceptIds.length);
      }

      let cls = avgMastery >= 80 ? 'mastered' : avgMastery >= 40 ? 'learning' : total > 0 ? 'struggling' : 'none';
      let displayPct = total > 0 ? avgMastery + '%' : '—';
      html += `
        <div class="heat-row">
          <span class="heat-label">${sec.icon} ${sec.name}</span>
          <div class="heat-bar-wrap">
            <div class="heat-fill ${cls}" style="width:${avgMastery}%"></div>
          </div>
          <span class="heat-pct">${displayPct}</span>
        </div>`;
    });
    el.innerHTML = html;
  }

  function renderRecommendations(state) {
    let el = document.getElementById('recommendations');
    if (!el) return;
    let recs = [];

    // Check if any section has low engagement
    let sectionActivity = {};
    state.history.forEach(h => {
      sectionActivity[h.section] = (sectionActivity[h.section] || 0) + 1;
    });

    let sections = ['valency', 'formula', 'equation', 'balancing', 'symbols', 'converter'];
    let sectionNames = { valency:'Valency', formula:'Formula', equation:'Equations', balancing:'Balancing', symbols:'Symbols', converter:'Unit Convert' };

    // Find weakest section
    let weakest = { key: '', pct: 100 };
    sections.forEach(sec => {
      let filtered = state.history.filter(h => h.section === sec);
      let total = filtered.length;
      if (total >= 3) {
        let correct = filtered.filter(h => h.correct).length;
        let pct = Math.round(correct / total * 100);
        if (pct < weakest.pct) weakest = { key: sec, pct };
      }
    });

    if (weakest.key && weakest.pct < 60) {
      recs.push({
        icon: '🎯',
        text: `Focus on <span class="rec-highlight">${sectionNames[weakest.key]}</span> — your accuracy is ${weakest.pct}%. Try 10 more questions to improve.`
      });
    }

    // Check for untouched sections
    sections.forEach(sec => {
      if (!sectionActivity[sec]) {
        recs.push({
          icon: '🆕',
          text: `You haven't tried <span class="rec-highlight">${sectionNames[sec]}</span> yet. Start with a few questions!`
        });
      }
    });

    // Streak recommendation
    if (state.currentStreak > 0 && state.currentStreak < 5) {
      recs.push({
        icon: '🔥',
        text: `You're on a ${state.currentStreak}-question streak! Keep going to build momentum.`
      });
    }

    // Accuracy tip
    if (state.totalAnswered >= 10) {
      let stats = ChemEngine.getStats(state);
      if (stats.accuracy < 50) {
        recs.push({
          icon: '💡',
          text: `Your accuracy is ${stats.accuracy}%. Try reviewing the Cheatsheet before quizzing.`
        });
      } else if (stats.accuracy >= 80 && Object.keys(state.items).length > 20) {
        recs.push({
          icon: '🏆',
          text: `Excellent ${stats.accuracy}% accuracy! You're mastering the material.`
        });
      }
    }

    // XP milestone
    let xp = calculateXP(state);
    if (xp > 0 && xp < 500) {
      recs.push({
        icon: '⭐',
        text: `Earn <span class="rec-highlight">${500 - xp} more XP</span> to reach the 500 XP milestone!`
      });
    }

    if (recs.length === 0) {
      recs.push({
        icon: '👋',
        text: 'Start practicing to get personalized recommendations!'
      });
    }

    el.innerHTML = recs.map(r =>
      `<div class="rec-item"><span class="rec-icon">${r.icon}</span><span class="rec-text">${r.text}</span></div>`
    ).join('');
  }

  function renderWeakAreas(state) {
    let weakList = document.getElementById('weak-list');
    if (!weakList) return;
    let weak = ChemEngine.getWeakConcepts(state, 10);
    if (weak.length === 0) {
      weakList.innerHTML = '<li style="color:var(--text-light);padding:8px 0;font-size:0.8rem">No data yet. Keep practicing!</li>';
    } else {
      weakList.innerHTML = weak.map(w => {
        let name = w.id;
        let ion = ChemData.getIon(w.id);
        if (ion) name = ion.name + ' (' + ion.symbol + ')';
        else {
          let compounds = ChemData.generateCompounds();
          let comp = compounds.find(c => c.id === w.id);
          if (comp) name = comp.name;
        }
        return `<li><span>${name}</span><span class="weak-score">${w.mastery}%</span></li>`;
      }).join('');
    }
  }

  function closeProgressPanel() {
    let panel = document.getElementById('progress-panel');
    let overlay = document.getElementById('panel-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  function updateStats() {
    state = ChemEngine.load();
    let stats = ChemEngine.getStats(state);
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-correct').textContent = stats.correct;
    document.getElementById('stat-streak').textContent = stats.bestStreak;
    document.getElementById('stat-mastery').textContent = stats.accuracy + '%';

    let sectionDiv = document.getElementById('section-stats');
    if (!sectionDiv) return;
    let sections = [
      { key:'valency', icon:'⚛️', name:'Valency' },
      { key:'formula', icon:'✏️', name:'Formula' },
      { key:'equation', icon:'⚡', name:'Equation' },
      { key:'balancing', icon:'⚖️', name:'Balance' },
      { key:'symbols', icon:'🔤', name:'Symbols' },
      { key:'converter', icon:'📐', name:'Convert' },
      { key:'chemformulas', icon:'📋', name:'Formulas' }
    ];
    let html = '';
    sections.forEach(sec => {
      let filtered = state.history.filter(h => h.section === sec.key);
      let total = filtered.length;
      let correct = filtered.filter(h => h.correct).length;
      let pct = total > 0 ? Math.round(correct / total * 100) : 0;
      let cls = pct >= 75 ? 'good' : pct >= 40 ? 'ok' : 'bad';
      let barW = total > 0 ? pct : 0;
      html += `
        <div class="sec-stat">
          <span class="sec-icon">${sec.icon}</span>
          <span class="sec-name">${sec.name}</span>
          <div class="sec-bar"><div class="sec-fill ${cls}" style="width:${barW}%"></div></div>
          <span class="sec-pct">${total > 0 ? pct + '%' : '—'}</span>
        </div>`;
    });
    sectionDiv.innerHTML = html;
  }

  function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone!')) {
      if (confirm('Are you sure?')) {
        state = ChemEngine.reset();
        sessionCount = 0;
        localStorage.setItem('chemmaster_sessions', '0');
        updateStats();
        renderMasteryHeat(state);
        renderRecommendations(state);
        renderWeakAreas(state);
        document.getElementById('stat-xp').textContent = '0';
        document.getElementById('stat-sessions').textContent = '0';
        document.getElementById('stat-mastered').textContent = '0';
        document.getElementById('stat-practice').textContent = '0';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
