/**
 * ================================
 * MENU TREE UTILS
 * ================================
 * Cấu trúc node:
 * {
 *   id,
 *   name,
 *   parentId,
 *   sortOrder,
 *   children: []
 * }
 */

/**
 * Thêm mới menu vào cây + sắp xếp
 * @param {Array} tree
 * @param {Object} newMenu
 */
export function addMenuToTree(tree, newMenu) {
  const node = normalizeNode(newMenu);

  if (node.parentId == null) {
    tree.push(node);
  } else {
    const parent = findNode(tree, node.parentId);
    if (!parent) {
      console.warn("addMenuToTree: parent not found", node.parentId);
      return;
    }
    parent.children.push(node);
  }

  sortTree(tree);
}

/**
 * Xóa menu khỏi cây theo id
 * @param {Array} tree
 * @param {number|string} id
 * @returns {boolean}
 */
export function removeMenuFromTree(tree, id) {
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i].id === id) {
      tree.splice(i, 1);
      return true;
    }

    if (tree[i].children.length) {
      const removed = removeMenuFromTree(tree[i].children, id);
      if (removed) return true;
    }
  }
  return false;
}

/**
 * Update menu (đổi parent / sortOrder)
 * @param {Array} tree
 * @param {Object} menu
 */
export function updateMenuInTree(tree, menu) {
  removeMenuFromTree(tree, menu.id);
  addMenuToTree(tree, menu);
}

/**
 * Thêm hoặc update menu (gộp)
 * @param {Array} tree
 * @param {Object} menu
 */
export function upsertMenuTree(tree, menu) {
  removeMenuFromTree(tree, menu.id);
  addMenuToTree(tree, menu);
}

/**
 * ================================
 * PRIVATE FUNCTIONS
 * ================================
 */

function normalizeNode(menu) {
  return {
    ...menu,
    children: menu.children ? [...menu.children] : [],
  };
}

function findNode(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function sortTree(tree) {
  tree.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  tree.forEach((node) => sortTree(node.children));
}
