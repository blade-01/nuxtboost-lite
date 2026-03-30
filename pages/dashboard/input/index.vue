<script setup lang="ts">
import useValidations from "~/composables/useValidations";
const { toast } = useAppFeedback();
definePageMeta({
  layout: "dashboard",
  middleware: "role-access",
  roles: ["admin", "member", "staff"],
});
useHead({
  title: "Forms",
});

const { mainSchema } = useValidations();
const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];

const countries = [
  {
    label: "Nigeria",
    value: "nigeria",
  },
  {
    label: "Malaysia",
    value: "malaysia",
  },
  {
    label: "Finland",
    value: "finland",
  },
];

const cities = [
  {
    label: "Lagos",
    value: "lagos",
  },
  {
    label: "Abuja",
    value: "abuja",
  },
  {
    label: "Port Harcourt",
    value: "port-harcourt",
  },
  {
    label: "Ibadan",
    value: "ibadan",
  },
];

const items = ref<string[]>([]);
function search(event: { query: string }) {
  items.value = [...Array(10).keys()].map((item) => event.query + "-" + item);
}
function searchChips(event: { query: string }) {
  chipSuggestions.value = [...Array(6).keys()].map(
    (item) => `${event.query}-${item + 1}`,
  );
}
const chipSuggestions = ref<string[]>([]);

function handleFormSubmit() {
  toast.success("Form submitted successfully");
}

function onInvalidSubmit() {
  const el = document.querySelector(".error");
  if (el) {
    el.classList.add("scroll-mt-16");
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
}
</script>

<template>
  <DashboardWrapper title="Inputs">
    <div class="space-y-6">
      <section
        class="overflow-hidden rounded-[30px] border border-border-primary bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_44%,#eef2f7_100%)] px-6 py-7 shadow-sm shadow-slate-200/70"
      >
        <div class="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
          <div class="max-w-2xl">
            <p
              class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon"
            >
              Input Studio
            </p>
            <h2
              class="mt-3 text-3xl font-semibold tracking-tight text-text-primary"
            >
              A richer form lab with grouped controls, cleaner scanning, and a
              stronger dashboard identity.
            </h2>
            <p class="mt-3 text-sm leading-6 text-text-secondary">
              The sections below are arranged like a product form workspace
              rather than a plain component dump, so text fields, uploads,
              dropdowns, and date controls feel intentional.
            </p>
          </div>
          <div class="grid gap-3 text-sm text-text-secondary">
            <div
              class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3"
            >
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">
                Controls
              </p>
              <p class="mt-2 font-medium text-text-primary">
                Text, uploads, chips, dropdowns, dates
              </p>
            </div>
            <div
              class="rounded-2xl border border-border-primary bg-white/80 px-4 py-3"
            >
              <p class="text-xs uppercase tracking-[0.22em] text-text-icon">
                Validation
              </p>
              <p class="mt-2 font-medium text-text-primary">
                Schema-driven submit and error focus
              </p>
            </div>
          </div>
        </div>
      </section>

      <Form
        v-slot="{ errors }"
        :validation-schema="mainSchema"
        @submit="handleFormSubmit"
        @invalid-submit="onInvalidSubmit"
      >
        <div class="space-y-5">
          <!-- Basic Inputs -->
          <section
            class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
          >
            <div class="mb-4">
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
              >
                Section One
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                Basic Inputs
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-3">
              <UiInputField
                name="first_name"
                label="First Name"
                placeholder="First Name"
                required
                :error="errors.first_name"
              />
              <UiInputField
                name="last_name"
                label="Last Name"
                placeholder="Last Name"
                required
                :error="errors.last_name"
              />
              <UiInputField
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                required
                :error="errors.email"
              />
              <UiInputField
                name="portfolio"
                type="url"
                label="Portfolio"
                placeholder="Portfolio"
                required
                :error="errors.portfolio"
              />
              <UiInputPassword
                name="password"
                label="Password"
                placeholder="Password"
                required
                :error="errors.password"
              />
              <UiInputPassword
                name="password_confirmation"
                label="Confirm Password"
                placeholder="Confirm Password"
                required
                :error="errors.password_confirmation"
              />
              <UiInputNumber
                name="currency"
                currency="NGN"
                locale="en-NG"
                label="Currency"
                mode="currency"
                required
                :error="errors.currency"
              />
              <UiInputField
                as="textarea"
                name="message"
                label="Message"
                placeholder="Message"
                required
                :error="errors.message"
              />
            </div>
          </section>
          <!-- ./ Basic Inputs -->

          <!-- Not So Basic Inputs -->
          <section
            class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
          >
            <div class="mb-4">
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
              >
                Section Two
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                Not So Basic Inputs
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-3">
              <UiInputPhone
                name="phone_number"
                label="Phone Number"
                placeholder="Phone Number"
                required
                :error="errors.phone_number"
              />
              <UiInputMultiple
                name="chips"
                label="Multiple Inputs"
                placeholder="Add multiple values"
                required
                :suggestions="chipSuggestions"
                :error="errors.chips"
                @complete="searchChips"
              />
              <UiInputAutocomplete
                name="autocomplete"
                label="Autocomplete"
                placeholder="Search a location"
                required
                :suggestions="items"
                :error="errors.autocomplete"
                @complete="search"
              />
              <UiInputFile
                name="image"
                label="Image Upload"
                placeholder="Upload File"
                required
                prepend-icon="bx:cloud-upload"
                :error="errors.image"
                accept="image/*"
              />
              <UiInputFile
                name="images"
                label="Multiple Image Upload"
                placeholder="Upload Multiple Files"
                required
                prepend-icon="bx:cloud-upload"
                :error="errors.images"
                multiple
                accept="image/*"
              />
              <UiInputFile
                name="file"
                label="File Upload"
                placeholder="Upload File"
                required
                prepend-icon="bx:cloud-upload"
                :error="errors.file"
              />
              <UiInputFile
                name="files"
                label="Multiple File Upload"
                placeholder="Upload Multiple Files"
                required
                prepend-icon="bx:cloud-upload"
                :error="errors.files"
                multiple
              />
            </div>
          </section>
          <!-- ./ Not So Basic Inputs -->

          <!-- Dropdowns -->
          <section
            class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
          >
            <div class="mb-4">
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
              >
                Section Three
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                Dropdowns
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-3">
              <UiInputDropdown
                name="gender"
                :options="genders"
                option-label="label"
                option-value="value"
                label="Basic Dropdown"
                filter
                show-clear
                required
                :error="errors.gender"
              />
              <UiInputMultiSelect
                name="country"
                :options="countries"
                option-label="label"
                option-value="value"
                label="Multiselect Dropdown"
                filter
                show-clear
                required
                :error="errors.country"
              />
              <UiInputMultiSelect
                name="city"
                :options="cities"
                option-label="label"
                option-value="value"
                label="Multiselect Dropdown with chips"
                filter
                show-clear
                required
                :error="errors.city"
                display="chip"
              />
            </div>
          </section>
          <!-- ./ Dropdowns -->

          <!-- Checkbox, Radio Button and Switch -->
          <section
            class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
          >
            <div class="mb-4">
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
              >
                Section Four
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                Checkbox, Radio Button and Switch
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-3">
              <UiInputCheckbox name="checkbox" label="Checkbox" />
              <UiInputRadiobutton name="radio" label="Radio button" />
              <UiInputSwitch name="switch" label="Switch" />
            </div>
          </section>
          <!-- ./ Checkbox, Radio Button and Switch -->

          <!-- Date Pickers -->
          <section
            class="rounded-[26px] border border-border-primary bg-white/85 p-6 shadow-sm shadow-slate-200/70"
          >
            <div class="mb-4">
              <p
                class="text-xs font-semibold uppercase tracking-[0.24em] text-text-icon"
              >
                Section Five
              </p>
              <p class="mt-2 text-2xl font-semibold text-text-primary">
                Date Pickers
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3 lg:grid-cols-3">
              <UiInputDatePicker
                required
                :error="errors.date"
                name="date"
                label="Day"
                dateFormat="dd-mm-yy"
              />
              <UiInputDatePicker
                required
                :error="errors.month"
                name="month"
                label="Month"
                view="month"
                dateFormat="mm/yy"
              />
              <UiInputDatePicker
                required
                :error="errors.year"
                name="year"
                label="Year"
                view="year"
                dateFormat="yy"
              />
              <UiInputDatePicker
                required
                :error="errors.date_time"
                name="date_time"
                label="Date with time"
                showTime
                hourFormat="12"
                dateFormat="dd-mm-yy"
              />
              <UiInputDatePicker
                required
                :error="errors.time"
                name="time"
                label="Time"
                timeOnly
                hourFormat="24"
              />
              <UiInputDatePicker
                required
                :error="errors.multiple"
                name="multiple"
                label="Multiple Dates"
                selectionMode="multiple"
              />
              <UiInputDatePicker
                required
                :error="errors.range"
                name="range"
                label="Date Range"
                selectionMode="range"
              />
            </div>
          </section>
          <!-- ./ Date Pickers -->

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2.5">
            <UiBtn label="Cancel" size="sm" type="button" class="btn-default" />
            <UiBtn label="Submit" size="sm" />
          </div>
          <!-- ./ Action Buttons -->
        </div>
      </Form>
    </div>
  </DashboardWrapper>
</template>

<style scoped></style>
