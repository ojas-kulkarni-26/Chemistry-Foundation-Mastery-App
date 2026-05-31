/* === ADAPTIVE LEARNING ENGINE === */
window.ChemEngine = (function() {

  const STORAGE_KEY = 'chemmaster_progress';

  function defaultState() {
    return {
      items: {},      // conceptId -> mastery data
      history: [],    // { conceptId, correct, time, section, timestamp }
      chart: [],      // rolling mastery scores for chart
      bestStreak: 0,
      currentStreak: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      valencyLevel: 1
    };
  }

  function load() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return defaultState();
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e) {}
  }

  function getItem(state, id) {
    if (!state.items[id]) {
      state.items[id] = {
        mastery: 0,
        consecutiveCorrect: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        totalTime: 0,
        lastSeen: 0
      };
    }
    return state.items[id];
  }

  // Record an answer and return updated state
  function recordAnswer(state, conceptId, correct, timeMs, section) {
    let item = getItem(state, conceptId);
    item.totalAttempts++;
    item.lastSeen = Date.now();
    item.totalTime += timeMs;

    state.totalAnswered++;
    if (correct) {
      item.correctAttempts++;
      item.consecutiveCorrect++;
      state.currentStreak++;
      if (state.currentStreak > state.bestStreak) state.bestStreak = state.currentStreak;
      // SM-2 style: mastery increases, more for consecutive correct
      let bonus = Math.min(item.consecutiveCorrect * 2, 15);
      item.mastery = Math.min(100, item.mastery + 8 + bonus);
      state.totalCorrect++;
    } else {
      item.consecutiveCorrect = 0;
      state.currentStreak = 0;
      // Significant penalty for wrong answer
      let penalty = 20 + (item.mastery > 50 ? 10 : 0);
      item.mastery = Math.max(0, item.mastery - penalty);
    }

    state.history.push({ conceptId, correct, time:timeMs, section, timestamp:Date.now() });
    // Keep last 500 entries
    if (state.history.length > 500) state.history.splice(0, state.history.length - 500);

    // Update chart (record overall mastery every 5 answers)
    if (state.totalAnswered % 5 === 0 || state.totalAnswered <= 10) {
      let overall = state.totalAnswered > 0
        ? Math.round((state.totalCorrect / state.totalAnswered) * 100)
        : 0;
      state.chart.push({ x: state.totalAnswered, y: overall });
      if (state.chart.length > 100) state.chart.splice(0, state.chart.length - 100);
    }

    save(state);
    return state;
  }

  // Pick next concept from a list of available concepts
  function selectNext(state, availableConcepts) {
    if (!availableConcepts || availableConcepts.length === 0) return null;

    let now = Date.now();
    let scored = availableConcepts.map(concept => {
      let id = concept.id || concept;
      let item = state.items[id];
      if (!item) {
        return { concept, priority: 1.0 + Math.random() * 0.1 };
      }
      let mastery = item.mastery || 0;
      let errorRate = item.totalAttempts > 0
        ? 1 - (item.correctAttempts / item.totalAttempts)
        : 0.5;
      let timeSinceLastSeen = now - item.lastSeen;
      let hoursSince = timeSinceLastSeen / (1000 * 60 * 60);
      let recency = Math.min(hoursSince / 4, 1);
      let avgTime = item.totalAttempts > 0
        ? item.totalTime / item.totalAttempts
        : 0;
      let speedFactor = Math.min(avgTime / 15000, 1);

      let priority = (100 - mastery) / 100 * 0.35
                    + recency * 0.25
                    + errorRate * 0.25
                    + speedFactor * 0.15;
      // Add jitter to avoid always picking the same item
      priority += Math.random() * 0.05;
      return { concept, priority };
    });

    scored.sort((a, b) => b.priority - a.priority);
    // Pick from top 30% randomly (weighted toward top)
    let topCount = Math.max(1, Math.floor(scored.length * 0.3));
    let pick = Math.floor(Math.random() * topCount);
    return scored[pick].concept;
  }

  // Get weakest concepts for display
  function getWeakConcepts(state, limit) {
    let entries = Object.entries(state.items)
      .filter(([id, item]) => item.totalAttempts >= 2)
      .map(([id, item]) => ({
        id,
        mastery: item.mastery,
        errorRate: 1 - (item.correctAttempts / item.totalAttempts)
      }))
      .sort((a, b) => a.mastery - b.mastery);
    return entries.slice(0, limit || 10);
  }

  // Get overall stats
  function getStats(state) {
    let total = state.totalAnswered;
    let correct = state.totalCorrect;
    return {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      streak: state.currentStreak,
      bestStreak: state.bestStreak,
      chart: state.chart,
      totalItems: Object.keys(state.items).length
    };
  }

  // Reset all progress
  function reset() {
    let s = defaultState();
    save(s);
    return s;
  }

  // Check if a concept needs immediate follow-up (just got it wrong)
  function needsFollowUp(state, conceptId) {
    let item = state.items[conceptId];
    return item && item.consecutiveCorrect === 0 && item.totalAttempts > 0 && item.totalAttempts <= 3;
  }

  return {
    defaultState, load, save, getItem,
    recordAnswer, selectNext, getWeakConcepts,
    getStats, reset, needsFollowUp
  };
})();
