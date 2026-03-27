export default () => {
  const axisColor = "#94a3b8"
  const gridColor = "rgba(148, 163, 184, 0.18)"

  const revenueTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [18200, 21400, 19850, 25400, 28600, 24100, 31900],
        borderColor: "#0f172a",
        backgroundColor: "rgba(15, 23, 42, 0.12)",
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0f172a",
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  }

  const volumeMixData = {
    labels: ["POS", "Transfers", "Bills", "Airtime"],
    datasets: [
      {
        data: [42, 28, 18, 12],
        backgroundColor: ["#0f172a", "#334155", "#64748b", "#cbd5e1"],
        borderColor: "#ffffff",
        borderWidth: 5,
        hoverOffset: 8
      }
    ]
  }

  const merchantGrowthData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "New merchants",
        data: [18, 26, 21, 32, 38],
        backgroundColor: "#0f172a",
        borderRadius: 12,
        borderSkipped: false
      },
      {
        label: "KYC approved",
        data: [12, 18, 19, 24, 29],
        backgroundColor: "#cbd5e1",
        borderRadius: 12,
        borderSkipped: false
      }
    ]
  }

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 650,
      easing: "easeOutQuart" as const
    },
    plugins: {
      legend: {
        labels: {
          color: "#334155",
          usePointStyle: true,
          boxWidth: 10,
          padding: 18
        }
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        padding: 12,
        displayColors: true
      }
    }
  }

  return {
    revenueTrendData,
    volumeMixData,
    merchantGrowthData,
    chartOptions: {
      line: {
        ...baseOptions,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: axisColor }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: axisColor }
          }
        }
      },
      doughnut: {
        ...baseOptions,
        cutout: "68%"
      },
      bar: {
        ...baseOptions,
        scales: {
          x: {
            stacked: false,
            grid: { display: false },
            ticks: { color: axisColor }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: axisColor }
          }
        }
      }
    }
  }
}
