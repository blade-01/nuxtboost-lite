<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest"
})
useHead({
  title: "Sign In"
})

const { signinSchema } = useValidations()
const router = useRouter()

const submitSignin = async () => {
  const { toast } = useAppFeedback()
  await toast.success("Starter sign-in form submitted.")
  await router.push("/dashboard")
}
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">Welcome back</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
      Sign in to the starter workspace.
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-secondary">
      This page is intentionally scaffolded so teams can wire their own auth logic without first
      building the screen shell and validation pattern.
    </p>

    <Form v-slot="{ errors }" :validation-schema="signinSchema" class="mt-8" @submit="submitSignin">
      <UiInputField
        name="email"
        type="email"
        label="Email address"
        required
        :error="errors.email"
      />
      <UiInputPassword name="password" label="Password" required :error="errors.password" />
      <div class="mt-2 flex items-center justify-between text-sm">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-text-secondary transition hover:text-text-primary"
        >
          Forgot password?
        </NuxtLink>
        <NuxtLink to="/auth/signup" class="text-text-secondary transition hover:text-text-primary">
          Create account
        </NuxtLink>
      </div>
      <UiBtn type="submit" label="Sign In" class="mt-6 w-full" />
    </Form>
  </div>
</template>
