import { install as installTailvue } from "tailvue";

export default defineNuxtPlugin((nuxtApp) => {
  installTailvue(nuxtApp.vueApp);
});
