<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest"
})

useHead({
  title: "Verify OTP"
})

const route = useRoute()
const router = useRouter()
const { otpSchema } = useValidations()

const recoveryEmail = computed(() => {
  const value = route.query.email
  return Array.isArray(value) ? value[0] || "" : value || ""
})

const submitOtp = async () => {
  const { toast } = useAppFeedback()
  await toast.success("OTP verified successfully.")
  await router.push({
    path: "/auth/reset-password",
    query: {
      email: recoveryEmail.value
    }
  })
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">
      Verification step
    </p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
      Enter the verification code.
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-secondary">
      We sent a one-time code
      <span v-if="recoveryEmail" class="font-medium text-text-primary">
        to {{ recoveryEmail }}
      </span>
      <span v-else>to your email address</span>.
    </p>

    <Form
      v-slot="{ errors, values, setFieldValue, submitCount }"
      :validation-schema="otpSchema"
      :validate-on-mount="false"
      class="mt-8"
      @submit="submitOtp"
    >
      <div class="input-group" :class="{ error: submitCount > 0 && errors.otp }">
        <label for="otp">
          Verification code
          <span class="required-mark">*</span>
        </label>
        <UiInputOtp
          :fields="6"
          :focus="true"
          :model-value="values.otp"
          :error="submitCount > 0 ? errors.otp : undefined"
          field-class="!h-[48px] !w-[48px] !rounded-[12px] !border-border-primary !text-text-primary !shadow-sm !shadow-slate-200/50"
          @update:modelValue="setFieldValue('otp', $event, false)"
        />
        <span v-if="submitCount > 0 && errors.otp" class="error-message">
          {{ errors.otp }}
        </span>
      </div>

      <UiBtn type="submit" label="Verify Code" class="mt-6 w-full" />
      <div class="mt-4 flex items-center justify-between text-sm">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-text-secondary transition hover:text-text-primary"
        >
          Go back
        </NuxtLink>
        <button type="button" class="text-text-secondary transition hover:text-text-primary">
          Resend code
        </button>
      </div>
    </Form>
  </div>
</template>
