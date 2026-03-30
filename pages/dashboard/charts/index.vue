<script setup lang="ts">
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "vue-chartjs";

definePageMeta({ layout: "dashboard" });

useHead({
  title: "Charts",
});

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
);

const { revenueTrendData, volumeMixData, merchantGrowthData, chartOptions } =
  useCharts();
</script>

<template>
  <DashboardWrapper title="Charts">
    <div class="space-y-6">
      <section
        class="rounded-[28px] border border-border-primary bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.18),_transparent_36%),linear-gradient(135deg,#ffffff_0%,#f8fafc_45%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon"
        >
          Analytics
        </p>
        <div
          class="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
        >
          <div class="max-w-2xl">
            <h2 class="text-3xl font-semibold tracking-tight text-text-primary">
              Chart surfaces with soft transitions and clearer admin reporting.
            </h2>
            <p class="mt-3 text-sm leading-6 text-text-secondary">
              Revenue, volume split, and merchant growth now live on a dedicated
              dashboard page instead of the old unused placeholder config.
            </p>
          </div>
        </div>
      </section>

      <div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <DashboardChartCard
          title="Revenue Trend"
          subtitle="Daily settlement volume over the last 7 days."
        >
          <Line :data="revenueTrendData" :options="chartOptions.line" />
        </DashboardChartCard>

        <DashboardChartCard
          title="Channel Mix"
          subtitle="Current payment volume split by channel."
        >
          <Doughnut :data="volumeMixData" :options="chartOptions.doughnut" />
        </DashboardChartCard>
      </div>

      <DashboardChartCard
        title="Merchant Growth"
        subtitle="Weekly merchant activations compared with KYC approvals."
      >
        <Bar :data="merchantGrowthData" :options="chartOptions.bar" />
      </DashboardChartCard>
    </div>
  </DashboardWrapper>
</template>
