// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: "%s | NuxtBoost",
      title: "NuxtBoost",
      meta: [
        { charset: "utf-8" },
        {
          name: "description",
          content: "NuxtBoost is a Nuxt starter for SaaS dashboards and admin interfaces."
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:url",
          content: "https://nuxtboost-lite.vercel.app"
        },
        {
          property: "og:title",
          content: "NuxtBoost | Reusable Nuxt starter for SaaS dashboards and admin interfaces."
        },
        {
          property: "og:description",
          content: "NuxtBoost is a Nuxt starter for SaaS dashboards and admin interfaces."
        },
        {
          property: "og:image",
          content: "https://res.cloudinary.com/bladencove/image/upload/v1700328807/RC/nb-light.svg"
        },
        {
          property: "twitter:card",
          content: "summary_large_image"
        },
        {
          property: "twitter:url",
          content: "https://nuxtboost-lite.vercel.app"
        },
        {
          property: "twitter:title",
          content: "NuxtBoost | Reusable Nuxt starter for SaaS dashboards and admin interfaces."
        },
        {
          property: "twitter:description",
          content: "NuxtBoost is a Nuxt starter for SaaS dashboards and admin interfaces."
        },
        {
          property: "twitter:image",
          content: "https://res.cloudinary.com/bladencove/image/upload/v1700328807/RC/nb-light.svg"
        },
        { name: "theme-color", content: "#ffffff" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        }
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }]
    }
  },
  devtools: { enabled: true },
  css: ["primeicons/primeicons.css", "@vuepic/vue-datepicker/dist/main.css"],
  plugins: ["~/plugins/vue-tel-input.ts", "~/plugins/primevue.ts", "~/plugins/tailvue.client.ts"],
  build: {
    transpile: ["primevue"]
  },
  /**
   * Environment variables
   */
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    public: {
      baseURL: process.env.API_BASE_URL
    }
  },
  /**
   * Modules configuration
   */
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@vee-validate/nuxt",
    "@sidebase/nuxt-auth"
  ],
  imports: {
    dirs: ["utils"]
  },
  eslint: {
    checker: false
  },
  /**
   * VeeValidate Configuration
   */
  veeValidate: {
    autoImports: true
  },
  /**
   * External Image Provider Configuration
   */
  image: {
    cloudinary: {
      baseURL: "https://res.cloudinary.com/bladencove/image/upload/RC"
    }
  },
  /**
   * nuxt-auth configuration
   */
  auth: {
    originEnvKey: false,
    baseURL: "/api/auth",
    provider: {
      type: "authjs",
      trustHost: true
    }
  }
})
