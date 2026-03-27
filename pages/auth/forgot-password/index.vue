<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest"
})
useHead({
  title: "Forgot Password"
})

const { forgotPasswordSchema } = useValidations()
const router = useRouter()

const submitReset = async (values: { email: string }) => {
  const { toast } = useAppFeedback()
  await toast.success("Password reset instructions queued.")
  await router.push({
    path: "/auth/otp",
    query: {
      email: values.email
    }
  })
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">Account recovery</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
      Send a password reset link.
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-secondary">
      A ready-made recovery page is part of most starters, even when the backend flow is still being
      wired.
    </p>

    <Form
      v-slot="{ errors }"
      :validation-schema="forgotPasswordSchema"
      class="mt-8"
      @submit="submitReset"
    >
      <UiInputField
        name="email"
        type="email"
        label="Email address"
        required
        :error="errors.email"
      />
      <UiBtn type="submit" label="Send Reset Link" class="mt-6 w-full" />
      <NuxtLink
        to="/auth/signin"
        class="mt-4 inline-flex text-sm text-text-secondary transition hover:text-text-primary"
      >
        Back to sign in
      </NuxtLink>
    </Form>
  </div>
</template>
