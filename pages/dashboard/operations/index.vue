<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member", "staff"],
});

useHead({
  title: "Operations",
});

type SettlementStatus = "Queued" | "Review" | "Processing" | "Completed";

type OperationRow = {
  _id: string;
  merchant: string;
  region: string;
  owner: string;
  status: SettlementStatus;
  flagged: boolean;
  volume: number;
  transactions: number;
  updated_at: string;
};

const allRows = ref<OperationRow[]>([
  {
    _id: "STL-20431",
    merchant: "Lumo Stores",
    region: "Lagos",
    owner: "Ada N.",
    status: "Queued",
    flagged: false,
    volume: 2850000,
    transactions: 128,
    updated_at: "2026-03-27T09:12:00",
  },
  {
    _id: "STL-20432",
    merchant: "Payfix Medical",
    region: "Abuja",
    owner: "Joy M.",
    status: "Review",
    flagged: true,
    volume: 1640000,
    transactions: 64,
    updated_at: "2026-03-27T08:50:00",
  },
  {
    _id: "STL-20433",
    merchant: "Halo Mobility",
    region: "Port Harcourt",
    owner: "Sam E.",
    status: "Processing",
    flagged: false,
    volume: 3190000,
    transactions: 151,
    updated_at: "2026-03-27T08:18:00",
  },
  {
    _id: "STL-20434",
    merchant: "Northwind Energy",
    region: "Lagos",
    owner: "Ada N.",
    status: "Completed",
    flagged: false,
    volume: 5240000,
    transactions: 208,
    updated_at: "2026-03-27T07:41:00",
  },
  {
    _id: "STL-20435",
    merchant: "Kora Foods",
    region: "Ibadan",
    owner: "Lara O.",
    status: "Queued",
    flagged: true,
    volume: 910000,
    transactions: 39,
    updated_at: "2026-03-27T07:06:00",
  },
  {
    _id: "STL-20436",
    merchant: "Axis Travel",
    region: "Abuja",
    owner: "Joy M.",
    status: "Completed",
    flagged: false,
    volume: 2780000,
    transactions: 115,
    updated_at: "2026-03-27T06:40:00",
  },
  {
    _id: "STL-20437",
    merchant: "Aster Labs",
    region: "Lagos",
    owner: "Sam E.",
    status: "Processing",
    flagged: true,
    volume: 1360000,
    transactions: 58,
    updated_at: "2026-03-27T06:01:00",
  },
  {
    _id: "STL-20438",
    merchant: "Cinder Retail",
    region: "Enugu",
    owner: "Lara O.",
    status: "Queued",
    flagged: false,
    volume: 760000,
    transactions: 27,
    updated_at: "2026-03-27T05:36:00",
  },
]);

const tableHeaders = [
  { key: "merchant", label: "Merchant" },
  { key: "region", label: "Region" },
  { key: "owner", label: "Owner" },
  { key: "transactions", label: "Transactions" },
  { key: "volume", label: "Volume" },
  { key: "status", label: "Status" },
  { key: "updated_at", label: "Updated" },
  { key: "actions", label: "Actions" },
];

const isLoading = ref(false);
const { toast } = useAppFeedback();

const { filters, resetFilters, shareUrl } = useUrlFilters({
  search: {
    default: "",
    parse: (value) => (Array.isArray(value) ? value[0] || "" : value || ""),
  },
  status: {
    default: "All" as SettlementStatus | "All",
    parse: (value) => {
      const normalized = Array.isArray(value) ? value[0] : value;
      const allowedValues = [
        "All",
        "Queued",
        "Review",
        "Processing",
        "Completed",
      ];
      return allowedValues.includes(normalized || "")
        ? (normalized as SettlementStatus | "All")
        : "All";
    },
  },
  region: {
    default: "All",
    parse: (value) =>
      Array.isArray(value) ? value[0] || "All" : value || "All",
  },
  flagged: {
    default: false,
    parse: (value) => {
      const normalized = Array.isArray(value) ? value[0] : value;
      return normalized === "true" || normalized === "1";
    },
    serialize: (value) => (value ? "true" : undefined),
  },
  page: {
    default: 1,
    parse: (value) => {
      const normalized = Number(Array.isArray(value) ? value[0] : value);
      return Number.isFinite(normalized) && normalized > 0 ? normalized : 1;
    },
    serialize: (value, defaultValue) =>
      value === defaultValue ? undefined : String(value),
  },
  pageSize: {
    default: 5,
    parse: (value) => {
      const normalized = Number(Array.isArray(value) ? value[0] : value);
      return normalized === 10 ? 10 : 5;
    },
  },
});

const {
  search,
  status: statusFilter,
  region: regionFilter,
  flagged: flaggedOnly,
  page,
  pageSize,
} = filters;

const pageSizeOptions = [5, 10];
const regionOptions = computed(() => [
  "All",
  ...new Set(allRows.value.map((item) => item.region)),
]);

const filteredRows = computed(() => {
  return allRows.value.filter((item) => {
    const matchesSearch =
      !search.value ||
      [item.merchant, item.owner, item._id]
        .join(" ")
        .toLowerCase()
        .includes(search.value.toLowerCase());
    const matchesStatus =
      statusFilter.value === "All" || item.status === statusFilter.value;
    const matchesRegion =
      regionFilter.value === "All" || item.region === regionFilter.value;
    const matchesFlagged = !flaggedOnly.value || item.flagged;

    return matchesSearch && matchesStatus && matchesRegion && matchesFlagged;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)),
);

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

const summaryCards = computed(() => {
  const source = filteredRows.value;

  return [
    {
      label: "Visible queue",
      value: source.length.toString(),
      note: "Records matching the current filter state.",
    },
    {
      label: "Flagged settlements",
      value: source.filter((item) => item.flagged).length.toString(),
      note: "Items requiring manual review or escalation.",
    },
    {
      label: "Visible volume",
      value: formatCurrency(
        source.reduce((sum, item) => sum + item.volume, 0),
        "NGN",
        "en-NG",
      ),
      note: "Combined settlement value in the current view.",
    },
    {
      label: "Processed today",
      value: source
        .filter(
          (item) => item.status === "Completed" || item.status === "Processing",
        )
        .length.toString(),
      note: "Completed or in-flight items from today.",
    },
  ];
});

watch([search, statusFilter, regionFilter, flaggedOnly, pageSize], () => {
  page.value = 1;
});

watch(totalPages, (value) => {
  if (page.value > value) {
    page.value = value;
  }
});

function clearFilters() {
  resetFilters();
}

function toggleLoadingState() {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 1100);
}

async function copyFilteredLink() {
  const valueToCopy = import.meta.client
    ? `${window.location.origin}${shareUrl.value}`
    : shareUrl.value;

  if (import.meta.client && navigator.clipboard) {
    await navigator.clipboard.writeText(valueToCopy);
    toast.success("Filtered link copied");
    return;
  }

  toast.show({
    title: "Share link",
    message: valueToCopy,
    type: "info",
  });
}
</script>

<template>
  <DashboardWrapper
    title="Operations"
    message="Production Flow"
    description="This page ties together filters, pagination, loading, and empty states into a single business screen so the starter has one reference page that feels close to a real admin workflow."
  >
    <div class="space-y-6">
      <DashboardPageHero
        eyebrow="Settlement Ops"
        title="A production-style operations queue for payments and settlements."
        description="Use this page as the starter reference when building real merchant, payout, reconciliation, or support workflows."
      >
        <div class="flex flex-wrap gap-3">
          <UiBtn label="Refresh queue" size="sm" @click="toggleLoadingState" />
          <UiBtn
            label="Copy filtered link"
            size="sm"
            class="btn-default"
            @click="copyFilteredLink"
          />
          <UiBtn
            label="Clear filters"
            size="sm"
            class="btn-default"
            @click="clearFilters"
          />
        </div>
      </DashboardPageHero>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-[24px] border border-border-primary bg-white/90 p-5 shadow-sm shadow-slate-200/60"
        >
          <p
            class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
          >
            {{ card.label }}
          </p>
          <p class="mt-3 text-2xl font-semibold text-text-primary">
            {{ card.value }}
          </p>
          <p class="mt-2 text-sm leading-6 text-text-secondary">
            {{ card.note }}
          </p>
        </article>
      </section>

      <section
        class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
      >
        <div class="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
          <label class="block">
            <span
              class="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-text-icon"
            >
              Search
            </span>
            <input
              v-model="search"
              type="text"
              class="input-style"
              placeholder="Search merchant, owner, or settlement ID"
            />
          </label>

          <label class="block">
            <span
              class="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-text-icon"
            >
              Status
            </span>
            <select v-model="statusFilter" class="input-style">
              <option value="All">All statuses</option>
              <option value="Queued">Queued</option>
              <option value="Review">Review</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label class="block">
            <span
              class="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-text-icon"
            >
              Region
            </span>
            <select v-model="regionFilter" class="input-style">
              <option
                v-for="region in regionOptions"
                :key="region"
                :value="region"
              >
                {{ region }}
              </option>
            </select>
          </label>

          <label class="flex items-end pb-2">
            <span
              class="inline-flex items-center gap-3 rounded-[14px] border border-border-primary bg-slate-50 px-4 py-3 text-sm text-text-primary"
            >
              <input
                v-model="flaggedOnly"
                type="checkbox"
                class="h-4 w-4 accent-slate-900"
              />
              Flagged only
            </span>
          </label>
        </div>
      </section>

      <section
        class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
      >
        <div
          class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Settlement Queue
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-text-primary">
              Review and move merchant settlements through operations.
            </h3>
          </div>
          <div class="flex items-center gap-3 text-sm text-text-secondary">
            <span>{{ filteredRows.length }} matching records</span>
            <select
              v-model="pageSize"
              class="rounded-xl border border-border-primary bg-white px-3 py-2 text-sm text-text-primary shadow-sm"
            >
              <option
                v-for="option in pageSizeOptions"
                :key="option"
                :value="option"
              >
                {{ option }} / page
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="space-y-3 rounded-2xl border border-border-primary bg-slate-50 p-4"
        >
          <div
            v-for="index in pageSize"
            :key="index"
            class="grid animate-pulse gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.9fr_0.7fr]"
          >
            <div class="h-4 rounded bg-slate-200"></div>
            <div class="h-4 rounded bg-slate-200"></div>
            <div class="h-4 rounded bg-slate-200"></div>
            <div class="h-4 rounded bg-slate-200"></div>
            <div class="h-4 rounded bg-slate-200"></div>
            <div class="h-4 rounded bg-slate-200"></div>
          </div>
        </div>

        <div
          v-else-if="filteredRows.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-primary bg-slate-50 px-6 py-14 text-center"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-text-primary shadow-sm shadow-slate-200/60"
          >
            <Icon name="mdi:clipboard-remove-outline" size="28" />
          </div>
          <p class="mt-5 text-xl font-semibold text-text-primary">
            No settlements match this view.
          </p>
          <p class="mt-2 max-w-md text-sm leading-6 text-text-secondary">
            Adjust the search or filters to widen the queue again. This gives
            the starter a proper empty state instead of just a blank table.
          </p>
          <UiBtn
            label="Reset filters"
            size="sm"
            class="mt-5"
            @click="clearFilters"
          />
        </div>

        <div v-else class="space-y-4">
          <UiDataTable :headers="tableHeaders" :items="paginatedRows">
            <template #merchant="item">
              <div>
                <p class="font-semibold text-text-primary">
                  {{ item.merchant }}
                </p>
                <p class="mt-1 text-xs text-text-secondary">{{ item._id }}</p>
              </div>
            </template>
            <template #transactions="item">
              {{ item.transactions }}
            </template>
            <template #volume="item">
              {{ formatCurrency(item.volume, "NGN", "en-NG") }}
            </template>
            <template #status="item">
              <span class="badge" :class="getStatusBadge(item.status)">
                {{ item.flagged ? `${item.status} • flagged` : item.status }}
              </span>
            </template>
            <template #updated_at="item">
              {{ showRelativeTime(item.updated_at, "DD MMM YYYY, HH:mm") }}
            </template>
            <template #actions>
              <UiBtn label="Review" size="xs" />
            </template>
          </UiDataTable>

          <div
            class="flex flex-col gap-3 border-t border-border-primary pt-4 md:flex-row md:items-center md:justify-between"
          >
            <p class="text-sm text-text-secondary">
              Page {{ page }} of {{ totalPages }}
            </p>
            <div class="flex items-center gap-2">
              <UiBtn
                label="Previous"
                size="xs"
                class="btn-default"
                :disabled="page <= 1"
                @click="page--"
              />
              <UiBtn
                label="Next"
                size="xs"
                class="btn-default"
                :disabled="page >= totalPages"
                @click="page++"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </DashboardWrapper>
</template>
