import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import { ConfirmationService, ToastService, DialogService } from "primevue";

// icons
import "primeicons/primeicons.css";
// ⭐ BẮT BUỘC CHO TREESELECT
import "primevue/dialog/style";
// import "primevue/treeselect/style";

export function setupPrimeVue(app) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });

  // 👉 services
  const services = [ConfirmationService, ToastService, DialogService];
  services.forEach((s) => app.use(s));
}
