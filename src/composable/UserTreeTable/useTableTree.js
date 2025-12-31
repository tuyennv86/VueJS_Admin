import { reactive } from "vue";

/**
 * useTableTree
 * Quản lý trạng thái expand/collapse cho table tree
 */
export function useTableTree() {
  /**
   * Map lưu trạng thái expand theo id
   * { [id]: true/false }
   */
  const expandedMap = reactive({});

  /* =============================
   * EXPAND / COLLAPSE
   * ============================= */

  const isExpanded = (id) => !!expandedMap[id];

  const toggle = (id) => {
    expandedMap[id] = !expandedMap[id];
  };

  const expand = (id) => {
    expandedMap[id] = true;
  };

  const collapse = (id) => {
    expandedMap[id] = false;
  };

  const expandAll = (tree) => {
    walk(tree, (node) => {
      expandedMap[node.id] = true;
    });
  };

  const collapseAll = () => {
    Object.keys(expandedMap).forEach((k) => {
      expandedMap[k] = false;
    });
  };

  return {
    expandedMap,
    isExpanded,
    toggle,
    expand,
    collapse,
    expandAll,
    collapseAll,
  };
}

/* =============================
 * PRIVATE
 * ============================= */

function walk(tree, cb) {
  tree.forEach((node) => {
    cb(node);
    if (node.children?.length) {
      walk(node.children, cb);
    }
  });
}
