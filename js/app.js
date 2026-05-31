/* === MAIN APP CONTROLLER === */
(function() {

  let currentSection = 'valency';
  let state = ChemEngine.load();

  function init() {
    // Initialize chart
    let canvas = document.getElementById('progress-chart');
    if (canvas) ChemChart.init(canvas);

    // Initialize all sections
    ChemValency.init();
    ChemFormula.init();
    ChemEquation.init();
    ChemBalancing.init();

    // Navigation
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

    // Progress panel controls
    document.getElementById('progressBtn')?.addEventListener('click', openProgressPanel);
    document.getElementById('close-panel')?.addEventListener('click', closeProgressPanel);
    document.getElementById('panel-overlay')?.addEventListener('click', closeProgressPanel);

    // Start on valency
    navigateTo('valency');
  }

  function navigateTo(section) {
    currentSection = section;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Show active section
    document.querySelectorAll('.section').forEach(el => {
      el.classList.remove('active');
    });
    let target = document.getElementById('section-' + section);
    if (target) target.classList.add('active');

    // Update progress data
    updateStats();

    // Re-render section if needed
    switch(section) {
      case 'valency': ChemValency.render(); break;
      case 'formula': ChemFormula.render(); break;
      case 'equation': ChemEquation.render(); break;
      case 'balancing': ChemBalancing.render(); break;
    }
  }

  function openProgressPanel() {
    state = ChemEngine.load();
    updateStats();
    let panel = document.getElementById('progress-panel');
    let overlay = document.getElementById('panel-overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('show');

    // Draw chart
    let stats = ChemEngine.getStats(state);
    ChemChart.draw(stats.chart);

    // Update weak areas
    let weakList = document.getElementById('weak-list');
    if (weakList) {
      let weak = ChemEngine.getWeakConcepts(state, 10);
      if (weak.length === 0) {
        weakList.innerHTML = '<li style="color:var(--text-light)">No data yet. Keep practicing!</li>';
      } else {
        weakList.innerHTML = weak.map(w => {
          // Try to get a display name from any section's data
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
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
