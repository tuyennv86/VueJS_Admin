export function piniaResetPlugin({ store }) {
  // lưu snapshot initial state (sâu)
  const initial = JSON.parse(JSON.stringify(store.$state ?? {}));
  // debug (bỏ nếu muốn)
  //   console.log(`[piniaResetPlugin] store registered: ${store.$id}`, initial);

  // attach reset fn
  store.$resetStore = () => {
    // debug
    // console.log(`[piniaResetPlugin] resetting store: ${store.$id}`);
    store.$patch(JSON.parse(JSON.stringify(initial)));
  };
}
