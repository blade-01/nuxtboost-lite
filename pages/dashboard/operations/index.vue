<script setup lang="ts">
import {
  createDateRangeFilter,
  type UrlDateRange,
} from "~/composables/useUrlFilters";
import dayjs from "dayjs";
import { formatCurrency, showRelativeTime, getStatusBadge } from "~/utils";

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

type AppliedFilterState = {
  search: string;
  status: SettlementStatus | "All";
  region: string;
  flagged: boolean;
  dateRange: UrlDateRange;
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

const pageSizeOptions = [5, 10];
const statusOptions: Array<SettlementStatus | "All"> = [
  "All",
  "Queued",
  "Review",
  "Processing",
  "Completed",
];
const regionOptions = computed(() => [
  "All",
  ...new Set(allRows.value.map((item) => item.region)),
]);

const filterSchema = computed(() => ({
  search: {
    type: "text" as const,
    default: "",
    label: "Search",
    placeholder: "Stage local filters before submit",
    query: "search",
  },
  status: {
    type: "select" as const,
    default: "All" as SettlementStatus | "All",
    label: "Status",
    options: statusOptions,
    props: {
      showClear: true,
    },
    oneOf: statusOptions,
    query: (value: SettlementStatus | "All") =>
      value === "All" ? {} : { status: value },
  },
  region: {
    type: "select" as const,
    default: "All",
    label: "Region",
    options: regionOptions.value,
    props: {
      showClear: true,
    },
    oneOf: regionOptions.value,
  },
  flagged: {
    type: "switch" as const,
    default: false,
    label: "Flagged only",
    query: "flagged_only",
  },
  dateRange: createDateRangeFilter({
    label: "Updated between",
    queryKeys: {
      from: "updated_from",
      to: "updated_to",
    },
  }),
  page: {
    type: "number" as const,
    default: 1,
    min: 1,
    showInFilterPanel: false,
  },
  pageSize: {
    type: "select" as const,
    default: 5,
    options: pageSizeOptions,
    oneOf: pageSizeOptions,
    showInFilterPanel: false,
  },
}));

const {
  filters,
  filterModel,
  fields,
  applyFilters,
  resetFilters,
  apiQuery,
  shareUrl,
} = useUrlFilters(filterSchema, {
  mode: "manual",
});

const {
  search,
  status: statusFilter,
  region: regionFilter,
  flagged: flaggedOnly,
  dateRange,
  page,
  pageSize,
} = filters;

const createAppliedFilterState = (): AppliedFilterState => ({
  search: search.value,
  status: statusFilter.value,
  region: regionFilter.value,
  flagged: flaggedOnly.value,
  dateRange: {
    from: dateRange.value.from,
    to: dateRange.value.to,
  },
});

const appliedFilters = ref<AppliedFilterState>(createAppliedFilterState());

const filteredRows = computed(() => {
  return allRows.value.filter((item) => {
    const updatedAt = dayjs(item.updated_at);
    const matchesSearch =
      !appliedFilters.value.search ||
      [item.merchant, item.owner, item._id]
        .join(" ")
        .toLowerCase()
        .includes(appliedFilters.value.search.toLowerCase());
    const matchesStatus =
      appliedFilters.value.status === "All" ||
      item.status === appliedFilters.value.status;
    const matchesRegion =
      appliedFilters.value.region === "All" ||
      item.region === appliedFilters.value.region;
    const matchesFlagged = !appliedFilters.value.flagged || item.flagged;
    const matchesDateRange =
      (!appliedFilters.value.dateRange.from ||
        updatedAt.isSame(dayjs(appliedFilters.value.dateRange.from), "day") ||
        updatedAt.isAfter(dayjs(appliedFilters.value.dateRange.from), "day")) &&
      (!appliedFilters.value.dateRange.to ||
        updatedAt.isSame(dayjs(appliedFilters.value.dateRange.to), "day") ||
        updatedAt.isBefore(dayjs(appliedFilters.value.dateRange.to), "day"));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRegion &&
      matchesFlagged &&
      matchesDateRange
    );
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

watch(
  [appliedFilters, pageSize],
  () => {
    page.value = 1;
  },
  { deep: true },
);

watch(totalPages, (value) => {
  if (page.value > value) {
    page.value = value;
  }
});

async function submitFilters() {
  await applyFilters();
  appliedFilters.value = createAppliedFilterState();
}

async function handleResetFilters() {
  await resetFilters();
  appliedFilters.value = createAppliedFilterState();
  await applyFilters();
}

function formatDateRange(value: UrlDateRange | undefined) {
  if (!value?.from && !value?.to) {
    return "No range selected";
  }

  return [value?.from || "Any", value?.to || "Any"].join(" -> ");
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
            @click="handleResetFilters"
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

      <section class="grid gap-5">
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Manual Filters
            </p>
            <h3 class="mt-2 text-2xl font-semibold text-text-primary">
              Keep local state until submit.
            </h3>
            <p class="mt-2 text-sm leading-6 text-text-secondary">
              This page now uses the schema-driven manual flow only. Filters
              update the table immediately, while the URL changes only when the
              user clicks apply.
            </p>
          </div>

          <form class="mt-5 space-y-4" @submit.prevent="submitFilters">
            <UiDataFilterPanel v-model="filterModel" :fields="fields" />

            <div class="flex flex-wrap gap-3">
              <UiBtn label="Apply filters" type="submit" size="sm" />
              <UiBtn
                label="Reset filters"
                type="button"
                size="sm"
                class="btn-default"
                @click="handleResetFilters"
              />
            </div>
          </form>

          <div
            class="mt-5 grid gap-3 rounded-2xl border border-border-primary bg-slate-50/80 p-4 text-sm text-text-secondary"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-text-icon"
              >
                Draft Range
              </p>
              <p class="mt-2 text-text-primary">
                {{ formatDateRange(dateRange) }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-text-icon"
              >
                Applied Share URL
              </p>
              <p class="mt-2 break-all text-text-primary">
                {{ shareUrl }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-text-icon"
              >
                Draft API Query Preview
              </p>
              <pre
                class="mt-2 overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100"
                >{{ JSON.stringify(apiQuery, null, 2) }}</pre
              >
            </div>
          </div>
        </section>
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
            <UiInputDropdown
              name="operations-page-size"
              :model-value="pageSize"
              :options="pageSizeOptions"
              outer-classes="mb-0"
              @update:modelValue="pageSize = Number($event)"
            />
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
            @click="handleResetFilters"
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
