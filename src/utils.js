export function findParentPanelFromTab(panel, tabId) {
  for (let tab of panel.tabs) {
    if (tab.id === tabId) {
      return panel;
    }
  }
  return null;
}

export function findTabParentPanelInBox(box, tabId) {
  let result;
  for (let child of box.children) {
    if ("children" in child) {
      result = result = findTabParentPanelInBox(child, tabId);
      if (result) {
        break;
      }
    } else if ("tabs" in child) {
      result = findParentPanelFromTab(child, tabId);
      if (result) {
        break;
      }
    }
  }
  return result;
}

/**
 * Searches the entire layout tree for the parent panel of a tab node.
 *
 * @param {*} layout The dock & float component hierarchy.
 * @param {*} tabId The id of the tab to search for.
 */
export function findTabParentPanel(layout, tabId) {
  let result = findTabParentPanelInBox(layout.dockbox, tabId);
  if (!result) {
    result = findTabParentPanelInBox(layout.floatbox, tabId);
  }
  return result;
}

export const selectLayoutDockBox = function selectLayoutDockBox(layout) {
  const { dockbox } = layout;
  return dockbox;
};
