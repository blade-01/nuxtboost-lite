<script lang="ts" setup>
interface Props {
  headers?: {
    key: string;
    label: string;
    sortable?: boolean;
  }[];
  items: Array<any>;
  selectable?: boolean;
  selectedItems?: Array<any>;
  selectField?: string;
  rowClasses?: string;
  stickyFirstColumn?: boolean;
  cellClass?: string;
  selectableHeaderClass?: string;
  selectableCellClass?: string;
  outerClass?: string;
  tableHeader?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: boolean;
  emptyStateClass?: string;
  errorMessage?: string;
  skeletonRows?: number;
}
const props = withDefaults(defineProps<Props>(), {
  headers: () => [],
  items: () => [],
  selectedItems: () => [],
  emptyMessage: "No results found.",
  loading: false,
  error: false,
  errorMessage: "Unable to load table data.",
  skeletonRows: 8,
});

const emits = defineEmits(["select", "update:selectedItems", "rowClick"]);

// Computed
const filteredItems = computed(() => props.items);

const selectedItems = computed<any>({
  get() {
    return props.selectedItems;
  },
  set(value) {
    emits("update:selectedItems", value);
  },
});

const tableColspan = computed(
  () => props.headers.length + (props.selectable ? 1 : 0),
);

const skeletonItems = computed(() =>
  Array.from({ length: props.skeletonRows }, (_, index) => ({
    _id: `skeleton-${index}`,
  })),
);

// Methods
const selectAll = () => {
  if (selectedItems.value.length === filteredItems.value.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = filteredItems.value.map(
      (item) => item[props.selectField || "_id"],
    );
  }
};

const isScrolled = ref(false);

function handleScroll(event: Event) {
  if (!props.stickyFirstColumn) return;

  const target = event.target as HTMLDivElement;
  const scrollLeft = target.scrollLeft;

  if (scrollLeft > 0) {
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }
}
</script>

<template>
  <div
    class="overflow-x-auto rounded-lg border"
    :class="[
      {
        'table-fixed-column': props.stickyFirstColumn,
      },
      outerClass,
    ]"
    @scroll="handleScroll"
  >
    <slot name="beforeTable"></slot>

    <table class="w-full table-auto text-left text-sm">
      <thead>
        <tr class="bg-bg-primary text-xs uppercase" :class="tableHeader">
          <th
            v-if="props.selectable"
            class="w-[30px] border-r bg-inherit p-3"
            :class="{
              'sticky left-0 z-[2]': props.stickyFirstColumn,
              'flex w-[70px] items-center justify-end': $slots.beforeCheckbox,
            }"
          >
            <input
              type="checkbox"
              scope="col"
              class="form-control"
              @change="selectAll"
              :checked="selectedItems.length === filteredItems.length"
            />
          </th>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            class="z-[1] whitespace-nowrap px-4 py-2 font-normal"
            :class="{
              'sticky left-[38px] z-[3] bg-inherit':
                props.stickyFirstColumn && header.key === headers[0]?.key,
              'sticky-column-shadow':
                isScrolled &&
                props.stickyFirstColumn &&
                header.key === headers[0]?.key,
              '!left-0':
                props.stickyFirstColumn &&
                header.key === headers[0]?.key &&
                !props.selectable,
              [tableHeader || '']: tableHeader,
            }"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="loading" class="w-full">
        <tr v-for="item in skeletonItems" :key="item._id">
          <td
            v-if="selectable"
            class="z-[1] w-[56px] px-4 py-5 align-middle"
            :class="{
              'sticky left-0 z-[2] bg-inherit': stickyFirstColumn,
              [selectableCellClass || '']: !!selectableCellClass,
            }"
          >
            <span class="table-skeleton block h-4 w-4 rounded-[4px]" />
          </td>
          <td
            v-for="header in headers"
            :key="header.key"
            class="z-1 whitespace-nowrap px-4 py-5 text-[15px] font-medium text-text-primary"
            :class="{
              'sticky left-[38px] z-[3] bg-inherit':
                stickyFirstColumn && header.key === headers[0]?.key,
              'sticky-column-shadow':
                isScrolled &&
                stickyFirstColumn &&
                header.key === headers[0]?.key,
              '!left-0':
                stickyFirstColumn &&
                header.key === headers[0]?.key &&
                !selectable,
              [cellClass || '']: !!cellClass,
            }"
          >
            <span
              class="table-skeleton block h-5 rounded-full"
              :class="
                header.key === headers[0]?.key
                  ? 'w-[72%]'
                  : header.key === headers[headers.length - 1]?.key
                    ? 'w-10'
                    : 'w-[58%]'
              "
            />
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="error" class="w-full">
        <tr>
          <td
            class="bg-white px-6 py-16 text-center text-sm text-text-secondary"
            :class="emptyStateClass"
            :colspan="tableColspan"
          >
            <slot name="error">
              {{ errorMessage }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="filteredItems.length <= 0" class="w-full">
        <tr>
          <td
            class="bg-white px-6 py-16 text-center text-sm text-text-secondary"
            :class="emptyStateClass"
            :colspan="tableColspan"
          >
            <slot name="empty">
              {{ emptyMessage }}
            </slot>
          </td>
        </tr>
      </tbody>
      <tbody class="w-full" v-else>
        <tr
          v-for="(item, i) in filteredItems"
          :key="i"
          class="group border-b bg-bg-primary last:border-b-0"
          :class="rowClasses"
        >
          <td
            v-if="props.selectable"
            class="z-[1] w-[30px] border-r p-3"
            :class="{
              'sticky left-0 z-[2] bg-inherit': props.stickyFirstColumn,
              'flex w-[70px] items-center justify-between':
                $slots.beforeCheckbox,
            }"
          >
            <div>
              <slot name="beforeCheckbox" v-bind="item"></slot>
            </div>
            <input
              v-model="selectedItems"
              :value="item[selectField || '_id']"
              type="checkbox"
              class="form-control"
            />
          </td>

          <td
            v-for="header in headers"
            :key="header.key"
            class="z-1 whitespace-nowrap px-4 py-2 text-sm"
            :class="{
              'sticky left-[38px] z-[3] bg-inherit':
                props.stickyFirstColumn && header.key === headers[0]?.key,
              'sticky-column-shadow':
                isScrolled &&
                props.stickyFirstColumn &&
                header.key === headers[0]?.key,
              '!left-0':
                props.stickyFirstColumn &&
                header.key === headers[0]?.key &&
                !props.selectable,
            }"
            @click.self="$emit('rowClick', item)"
          >
            <slot :name="header.key" v-bind="item">
              <template v-if="header.key.includes('.')">
                {{ item[header.key.split(".")[0]!][header.key.split(".")[1]!] }}
              </template>
              <template v-else>
                {{ item[header.key] }}
              </template>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sticky-column-shadow {
  @apply border-r-bg-primary shadow-md;
}
.table-fixed-column table {
  border-collapse: separate;
  background-color: transparent;
  border-spacing: 0;
}

.table-fixed-column td,
tr,
th {
  border-bottom: 1px solid #e2e8f0;
}

::-webkit-scrollbar {
  @apply h-1.5 w-4;
}

.table-skeleton {
  background: linear-gradient(
    90deg,
    rgba(239, 239, 239, 0.95) 0%,
    rgba(249, 249, 249, 1) 50%,
    rgba(239, 239, 239, 0.95) 100%
  );
  background-size: 200% 100%;
  animation: table-skeleton-shimmer 1.2s ease-in-out infinite;
}

@keyframes table-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
