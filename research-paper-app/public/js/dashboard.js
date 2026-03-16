// =====================================================
//  ResearchHub — Dashboard Charts (Chart.js v4)
// =====================================================

function initDashboardCharts(monthLabels, monthData, categoryLabels, categoryData) {
  Chart.defaults.color = '#8b949e';
  Chart.defaults.borderColor = '#30363d';
  Chart.defaults.font.family = "'DM Sans', sans-serif";

  // ── Bar Chart: Papers per month ──────────────────
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Papers Uploaded',
            data: monthData,
            backgroundColor: 'rgba(0, 217, 180, 0.25)',
            borderColor: '#00d9b4',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
            hoverBackgroundColor: 'rgba(0, 217, 180, 0.45)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#161b22',
            borderColor: '#30363d',
            borderWidth: 1,
            titleColor: '#e6edf3',
            bodyColor: '#8b949e',
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} paper${ctx.parsed.y !== 1 ? 's' : ''}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(48,54,61,0.6)' },
            ticks: { precision: 0, font: { size: 11 } },
            beginAtZero: true,
          },
        },
      },
    });
  }

  // ── Pie Chart: Papers by category ────────────────
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    const palette = [
      '#00d9b4', '#388bfd', '#a371f7', '#f78166',
      '#3fb950', '#f0b429', '#56d364', '#79c0ff',
      '#d2a8ff', '#ffa657', '#ff7b72', '#7ee787',
    ];

    const colors = (categoryLabels || []).map((_, i) => palette[i % palette.length]);

    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryData,
            backgroundColor: colors.map((c) => c + '33'),
            borderColor: colors,
            borderWidth: 2,
            hoverBackgroundColor: colors.map((c) => c + '66'),
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 12,
              font: { size: 11 },
              boxWidth: 12,
              color: '#8b949e',
            },
          },
          tooltip: {
            backgroundColor: '#161b22',
            borderColor: '#30363d',
            borderWidth: 1,
            titleColor: '#e6edf3',
            bodyColor: '#8b949e',
            padding: 12,
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.parsed} paper${ctx.parsed !== 1 ? 's' : ''} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }
}
