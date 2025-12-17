// src/stores/resetAll.js
import { getActivePinia } from "pinia";

export function resetAllStores() {
  const active = getActivePinia();
  if (!active) {
    // console.warn("resetAllStores: no active pinia");
    return;
  }

  // active._s là Map nội bộ chứa các store (key: id, value: store)
  // Dùng forEach trên Map
  active._s.forEach((store, id) => {
    if (typeof store.$resetStore === "function") {
      try {
        store.$resetStore();
      } catch (err) {
        // console.error("Error resetting store", id, err);
      }
    } else if (typeof store.resetMenu === "function") {
      // fallback nếu store định nghĩa hàm reset riêng
      try {
        store.resetMenu();
      } catch (err) {
        // console.error("Error calling fallback reset on store", id, err);
      }
    } else {
      // console.warn("No reset function on store", id);
    }
  });
}
