import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

// CSS
import "primeicons/primeicons.css";

export function setupPrimeVue(app) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });

  // 👉 services
  app.use(ConfirmationService);
  app.use(ToastService);
}
