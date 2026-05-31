/* === PROGRESS CHART (Canvas) === */
window.ChemChart = (function() {

  let canvas, ctx, dpr;

  function init(canvasEl) {
    canvas = canvasEl;
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
  }

  function draw(dataPoints) {
    if (!ctx || !canvas) return;
    let rect = canvas.getBoundingClientRect();
    let w = rect.width;
    let h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    let pad = { top: 16, bottom: 20, left: 32, right: 16 };
    let plotW = w - pad.left - pad.right;
    let plotH = h - pad.top - pad.bottom;

    if (plotW <= 0 || plotH <= 0) return;

    // Draw grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      let y = pad.top + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    if (!dataPoints || dataPoints.length < 2) {
      // Draw placeholder text
      ctx.fillStyle = '#adb5bd';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Answer more questions to see your progress', w/2, h/2);
      return;
    }

    let minX = dataPoints[0].x;
    let maxX = dataPoints[dataPoints.length - 1].x;
    let maxY = 100;
    let minY = 0;
    let rangeX = Math.max(maxX - minX, 1);

    // Draw Y-axis labels
    ctx.fillStyle = '#868e96';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      let val = Math.round(maxY - (maxY / 4) * i);
      let y = pad.top + (plotH / 4) * i;
      ctx.fillText(val + '%', pad.left - 6, y + 3);
    }

    // Draw X-axis labels (show first, middle, last)
    ctx.textAlign = 'center';
    let labels = [
      { x: dataPoints[0].x, label: dataPoints[0].x.toString() },
      { x: dataPoints[Math.floor(dataPoints.length/2)].x, label: dataPoints[Math.floor(dataPoints.length/2)].x.toString() },
      { x: dataPoints[dataPoints.length-1].x, label: dataPoints[dataPoints.length-1].x.toString() }
    ];
    labels.forEach((l, i) => {
      let px = pad.left + ((l.x - minX) / rangeX) * plotW;
      ctx.fillText('#' + l.label, px, h - 4);
    });

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    dataPoints.forEach((pt, i) => {
      let px = pad.left + ((pt.x - minX) / rangeX) * plotW;
      let py = pad.top + plotH - (pt.y / maxY) * plotH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw dots
    let step = Math.max(1, Math.floor(dataPoints.length / 15));
    dataPoints.forEach((pt, i) => {
      if (i % step !== 0 && i !== dataPoints.length - 1) return;
      let px = pad.left + ((pt.x - minX) / rangeX) * plotW;
      let py = pad.top + plotH - (pt.y / maxY) * plotH;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#6c5ce7';
      ctx.fill();
    });

    // Draw latest value label
    let last = dataPoints[dataPoints.length - 1];
    let lx = pad.left + ((last.x - minX) / rangeX) * plotW;
    let ly = pad.top + plotH - (last.y / maxY) * plotH;
    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(last.y + '%', lx, ly - 8);
  }

  return { init, draw };
})();
