<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest"
})
useHead({
  title: "Sign Up"
})

const { signupSchema } = useValidations()
const router = useRouter()

const submitSignup = async () => {
  const { toast } = useAppFeedback()
  await toast.success("Account created. Sign in to continue.")
  await router.push("/auth/signin")
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">New workspace</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
      Create an account for your SaaS starter.
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-secondary">
      Use this as the default sign-up surface and swap the submit handler for your provider, API
      call, or invite flow.
    </p>

    <Form v-slot="{ errors }" :validation-schema="signupSchema" class="mt-8" @submit="submitSignup">
      <UiInputField
        name="full_name"
        type="text"
        label="Full name"
        required
        :error="errors.full_name"
      />
      <UiInputField name="email" type="email" label="Work email" required :error="errors.email" />
      <UiInputPassword name="password" label="Password" required :error="errors.password" />
      <UiInputPassword
        name="password_confirmation"
        label="Confirm password"
        required
        :error="errors.password_confirmation"
      />
      <UiBtn type="submit" label="Create Account" class="mt-6 w-full" />
    </Form>
  </div>
</template>
