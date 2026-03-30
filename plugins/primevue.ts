import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import Skeleton from "primevue/skeleton";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import Dialog from "primevue/dialog";
import ContextMenu from "primevue/contextmenu";
import AutoComplete from "primevue/autocomplete";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import MultiSelect from "primevue/multiselect";
import Tooltip from "primevue/tooltip";

const AdminPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{slate.50}",
      100: "{slate.100}",
      200: "{slate.200}",
      300: "{slate.300}",
      400: "{slate.400}",
      500: "{slate.500}",
      600: "{slate.600}",
      700: "{slate.700}",
      800: "{slate.800}",
      900: "{slate.900}",
      950: "{slate.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.900}",
          contrastColor: "#ffffff",
          hoverColor: "{primary.800}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{surface.100}",
          focusBackground: "{surface.200}",
          color: "{surface.900}",
          focusColor: "{surface.950}",
        },
        formField: {
          background: "rgba(255, 255, 255, 0.92)",
          hoverBorderColor: "{surface.400}",
          focusBorderColor: "{surface.700}",
          iconColor: "{surface.500}",
        },
        overlay: {
          select: {
            background: "{surface.0}",
            borderColor: "{surface.200}",
            color: "{surface.800}",
          },
          popover: {
            background: "{surface.0}",
            borderColor: "{surface.200}",
            color: "{surface.800}",
          },
          modal: {
            background: "{surface.0}",
            borderColor: "{surface.200}",
            color: "{surface.800}",
          },
        },
      },
    },
  },
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .use(PrimeVue, {
      theme: {
        preset: AdminPreset,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    })
    .use(ConfirmationService);

  nuxtApp.vueApp.component("PvSelect", Select);
  nuxtApp.vueApp.component("PvDatePicker", DatePicker);
  nuxtApp.vueApp.component("PvAvatar", Avatar);
  nuxtApp.vueApp.component("PvMenu", Menu);
  nuxtApp.vueApp.component("PvSkeleton", Skeleton);
  nuxtApp.vueApp.component("PvPopup", ConfirmPopup);
  nuxtApp.vueApp.component("PvDialog", Dialog);
  nuxtApp.vueApp.component("PvContextMenu", ContextMenu);
  nuxtApp.vueApp.component("PvAutoComplete", AutoComplete);
  nuxtApp.vueApp.component("PvInputNumber", InputNumber);
  nuxtApp.vueApp.component("PvToggleSwitch", ToggleSwitch);
  nuxtApp.vueApp.component("PvMultiSelect", MultiSelect);
  nuxtApp.vueApp.directive("tooltip", Tooltip);
});
