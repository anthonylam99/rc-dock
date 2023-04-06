import { normalize, schema } from "normalizr";

export function normalizeLayout(layout) {
  const tab = new schema.Entity("tabs");
  const tabs = [tab];
  const panel = new schema.Entity("panels");
  const panels = [panel];
  panel.define({ children: panels, tabs: tabs });
  const dockbox = new schema.Entity("dockbox", {
    children: panels
  });
  const floatbox = new schema.Entity("floatbox", {
    children: panels
  });

  const normalizedLayout = normalize(layout, {
    dockbox: dockbox,
    floatbox: floatbox
  });

  return normalizedLayout;
}
