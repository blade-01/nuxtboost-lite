<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

useHead({
  title: "Set New Password",
});

const route = useRoute();
const router = useRouter();
const { resetPasswordSchema } = useValidations();

const recoveryEmail = computed(() => {
  const value = route.query.email;
  return Array.isArray(value) ? value[0] || "" : value || "";
});

const submitPasswordReset = async () => {
  const { toast } = useAppFeedback();
  await toast.success("Password updated successfully.");
  await router.push("/auth/signin");
};
</script>

<template>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-text-icon">
      New password
    </p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight text-text-primary">
      Set a fresh password for your account.
    </h1>
    <p class="mt-3 text-sm leading-6 text-text-secondary">
      Create a secure password
      <span v-if="recoveryEmail" class="font-medium text-text-primary">
        for {{ recoveryEmail }}
      </span>
      <span v-else>for your account</span>.
    </p>

    <Form
      v-slot="{ errors }"
      :validation-schema="resetPasswordSchema"
      class="mt-8"
      @submit="submitPasswordReset"
    >
      <UiInputPassword
        name="password"
        label="New password"
        required
        :error="errors.password"
      />
      <UiInputPassword
        name="password_confirmation"
        label="Confirm new password"
        required
        :error="errors.password_confirmation"
      />
      <UiBtn type="submit" label="Update Password" class="mt-6 w-full" />
      <NuxtLink
        to="/auth/signin"
        class="mt-4 inline-flex text-sm text-text-secondary transition hover:text-text-primary"
      >
        Return to sign in
      </NuxtLink>
    </Form>
  </div>
</template>
