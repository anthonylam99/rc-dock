export const tab = {
  closable: true
};

export const getTab = function getTab(id) {
  return {
    ...tab,
    id,
    title: id,
    group: "closeAll"
  };
};
