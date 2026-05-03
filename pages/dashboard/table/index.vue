<script lang="ts" setup>
import { formatDate, getStatusBadge } from "~/utils";
const { toast, modal } = useAppFeedback();
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member", "staff"],
});
useHead({
  title: "Table",
});
const headers = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone_number",
    label: "phone number",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "location",
    label: "location",
  },
  {
    key: "next_of_kin",
    label: "next of kin",
  },
  {
    key: "spouse",
    label: "spouse",
  },
  {
    key: "family_tree",
    label: "family tree",
  },
  {
    key: "created_at",
    label: "created at",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const items = ref([
  {
    _id: Math.random().toString().slice(2, 12).toLocaleUpperCase(),
    name: "John Doe",
    email: "jd@me.com",
    role: "Admin",
    status: "active",
    phone_number: "08012345678",
    location: "Lagos",
    next_of_kin: "Jane Doe",
    spouse: "Jane Doe",
    family_tree: "The Doe Family",
    created_at: "2023-08-12",
  },
  {
    _id: Math.random().toString().slice(2, 12).toLocaleUpperCase(),
    name: "Elijah Michaelson",
    email: "ej@me.com",
    role: "Quality Assurance",
    status: "neutral",
    phone_number: "080783456765",
    location: "Lagos",
    next_of_kin: "Rebeka Michaelson",
    spouse: "Caroline Forbes",
    family_tree: "The Michaelson's",
    created_at: "2023-08-5",
  },
]);
const selectedItems = ref<string[]>([]);

function handleRowClick(item: any) {
  toast.show({
    title: "Row Clicked",
    message: `Row with id ${item._id} was clicked`,
    type: "info",
  });
}

function requestDelete(itemId: string) {
  modal.show({
    type: "danger",
    title: "Delete record",
    body: "This action cannot be undone. The selected table entry will be removed immediately.",
    primary: {
      label: "Delete",
      theme: "red",
      action: () => {
        items.value = items.value.filter((item) => item._id !== itemId);
        selectedItems.value = selectedItems.value.filter(
          (item) => item !== itemId,
        );
        toast.success("Item deleted successfully");
      },
    },
    secondary: {
      label: "Cancel",
      theme: "white",
      action: () => {},
    },
  });
}
</script>

<template>
  <DashboardWrapper title="Tables">
    <div class="space-y-6">
      <section
        class="overflow-hidden rounded-[30px] border border-border-primary bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_46%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
      >
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div class="max-w-2xl">
            <p
              class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon"
            >
              Data Surfaces
            </p>
            <h2
              class="mt-3 text-3xl font-semibold tracking-tight text-text-primary"
            >
              Tables presented as live operations views instead of plain
              component samples.
            </h2>
            <p class="mt-3 text-sm leading-6 text-text-secondary">
              Use the different table configurations below to compare density,
              selection, sticky columns, and row actions in one place.
            </p>
          </div>
          <div
            class="grid gap-3 text-sm text-text-secondary sm:grid-cols-2 xl:grid-cols-3"
          >
            <div
              class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3"
            >
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">
                Records
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                {{ items.length }}
              </p>
            </div>
            <div
              class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3"
            >
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">
                Selected
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                {{ selectedItems.length }}
              </p>
            </div>
            <div
              class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3 sm:col-span-2 xl:col-span-1"
            >
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">
                Modes
              </p>
              <p class="mt-2 font-medium text-text-primary">
                Basic, selectable, sticky, clickable
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="space-y-5">
        <!-- Basic Table -->
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div class="mb-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Mode One
            </p>
            <p class="mt-2 text-2xl font-semibold text-text-primary">
              Basic Table
            </p>
          </div>
          <UiDataTable :headers="headers" :items="items">
            <template #actions="item">
              <UiMenuAction
                :items="[
                  {
                    label: 'Edit',
                    icon: 'bx:edit',
                    command: () => {
                      toast.info(`Edit action on ${item.name}`);
                    },
                  },
                  {
                    label: 'Delete',
                    icon: 'bx:trash',
                    command: () => {
                      requestDelete(item._id);
                    },
                  },
                ]"
              />
            </template>
          </UiDataTable>
        </section>
        <!-- ./ Basic Table -->

        <!-- Reshape-able Content Table -->
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div class="mb-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Mode Two
            </p>
            <p class="mt-2 text-2xl font-semibold text-text-primary">
              Reshape-able Content Table
            </p>
          </div>
          <UiDataTable :headers="headers" :items="items">
            <template #status="item">
              <UiStatus
                :label="item.status"
                :tone="item.status.toLowerCase()"
              />
            </template>
            <template #created_at="item">
              <span>{{
                formatDate(item?.created_at, "DD MMM, YYYY hh:mm A")
              }}</span>
            </template>
            <template #actions="item">
              <div class="flex space-x-2">
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                >
                  <Icon name="bx:edit" size="16" />
                </UiBtn>
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                  @click="requestDelete(item._id)"
                >
                  <Icon name="bx:trash" size="16" />
                </UiBtn>
              </div>
            </template>
          </UiDataTable>
        </section>
        <!-- ./ Reshape-able Content Table -->

        <!-- Selectable Table -->
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div class="mb-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Mode Three
            </p>
            <p class="mt-2 text-2xl font-semibold text-text-primary">
              Selectable Table
            </p>
          </div>
          <UiDataTable
            :headers="headers"
            :items="items"
            selectable
            v-model:selected-items="selectedItems"
          >
            <template #status="item">
              <UiStatus
                :label="item.status"
                :tone="item.status.toLowerCase()"
              />
            </template>
            <template #actions="item">
              <div class="flex space-x-2">
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                >
                  <Icon name="bx:edit" size="16" />
                </UiBtn>
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                  @click="requestDelete(item._id)"
                >
                  <Icon name="bx:trash" size="16" />
                </UiBtn>
              </div>
            </template>
          </UiDataTable>
        </section>
        <!-- ./ Selectable Table -->

        <!-- Sticky Column Table -->
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div class="mb-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Mode Four
            </p>
            <p class="mt-2 text-2xl font-semibold text-text-primary">
              Sticky Column Table
            </p>
          </div>
          <UiDataTable
            :headers="headers"
            :items="items"
            selectable
            v-model:selected-items="selectedItems"
            sticky-first-column
          >
            <template #status="item">
              <UiStatus
                :label="item.status"
                :tone="item.status.toLowerCase()"
              />
            </template>
            <template #actions="item">
              <div class="flex space-x-2">
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                >
                  <Icon name="bx:edit" size="16" />
                </UiBtn>
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                  @click="requestDelete(item._id)"
                >
                  <Icon name="bx:trash" size="16" />
                </UiBtn>
              </div>
            </template>
          </UiDataTable>
        </section>
        <!-- ./ Sticky Column Table -->

        <!-- Clickable Table -->
        <section
          class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
        >
          <div class="mb-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
            >
              Mode Five
            </p>
            <p class="mt-2 text-2xl font-semibold text-text-primary">
              Clickable Table
            </p>
          </div>
          <UiDataTable
            :headers="headers"
            :items="items"
            @row-click="handleRowClick"
            row-classes="cursor-pointer"
          >
            <template #status="item">
              <UiStatus
                :label="item.status"
                :tone="item.status.toLowerCase()"
              />
            </template>
            <template #actions="item">
              <div class="flex space-x-2">
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                >
                  <Icon name="bx:edit" size="16" />
                </UiBtn>
                <UiBtn
                  class="btn-btn-primary grid h-8 w-8 place-content-center !p-0"
                  @click="requestDelete(item._id)"
                >
                  <Icon name="bx:trash" size="16" />
                </UiBtn>
              </div>
            </template>
          </UiDataTable>
        </section>
        <!-- ./ Clickable Table -->
      </div>
    </div>
  </DashboardWrapper>
</template>

<style scoped></style>
