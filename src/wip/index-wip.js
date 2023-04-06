import React from "react";
import ReactDOM from "react-dom";
// import { addedDiff, updatedDiff, diff, detailedDiff } from "deep-object-diff";
import { DockLayout } from "rc-dock";
import "rc-dock/dist/rc-dock.css";

import "./styles.css";
import { difference, selectDeepestChild } from "./utils";

let tab = {
  content: <div>Tab Content</div>,
  closable: true
};

let layout = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        tabs: []
      }
    ]
  }
};

let groups = {
  closeAll: {
    floatable: true,
    closable: true,
    panelExtra: (panelData, context) => (
      <div
        className="my-panel-close-btn"
        onClick={() => context.dockMove(panelData, null, "remove")}
      >
        X
      </div>
    )
  }
};

function getTab(id, value) {
  return {
    ...tab,
    id,
    content: (
      <div>
        <p>
          It's easier to use React Context to update tab,
          <br />
          but in some use cases you might need to directly update the tab.
        </p>
        {id !== `tab${value}` ? (
          <p>Only current active tab will be changed</p>
        ) : null}
        value is {value}
      </div>
    ),
    title: id,
    group: "closeAll"
  };
}

class Root extends React.Component {
  selectDockBoxOf = layout => {
    const { dockbox } = layout;
    return dockbox;
  };

  addTab = panelId => {
    let panelData = this.dockLayout.find(panelId);
    ++this.count;
    let newTab = getTab(`tab${this.count}`, this.count);
    this.dockLayout.dockMove(newTab, panelData, "middle");
  };

  handleAddTabButtonClick = () => {
    // ! The <DockLayout> layout state is not identical to the controlling component.
    const { children } = this.selectDockBoxOf(this.dockLayout.state.layout);

    // Find a panel to add the new tab to.
    const [child] = children;
    const { id } = child;
    const isLastPanel = children.length === 1 && child.tabs.length === 0;

    if (isLastPanel) {
      // If no `layout.dockbox` panels exist, create one first.
      // Otherwise, tab appends won't work.
      const newLayout = {
        ...this.state.layout, // Preserve any existing tabs in `layout.floatbox`.
        layout // Overwrite the `layout.dockbox` tabs setup only.
      };
      this.setState(
        () => ({
          layout: newLayout,
          activePanelId: id
        }),
        () => {
          this.addTab(id);
        }
      );
      return;
    }

    this.addTab(this.state.activePanelId);
  };

  getRef = r => {
    this.dockLayout = r;
  };

  count = 0;

  state = {
    layout: layout,
    activePanelId: ""
  };

  handleLayoutChange = layout => {
    let change = updatedDiff(this.state.layout, layout);
    if (Object.keys(change).length === 0) {
      console.warn("not an update");
      change = addedDiff(this.state.layout, layout);
    }
    const changeDetails = detailedDiff(this.state.layout, layout);
    console.log("change");
    console.log("   ", "created:", changeDetails.added);
    console.log("   ", "updated:", changeDetails.updated);
    console.log("   ", "deleted:", changeDetails.deleted);

    const created = Object.keys(changeDetails.added).length;
    const deleted = Object.keys(changeDetails.deleted).length;
    const isLayoutDeleted =
      Object.keys(changeDetails.deleted).indexOf("layout") >= 0;
    console.log("isLayoutDeleted", isLayoutDeleted);
    if ((created > 0 && deleted === 0) || isLayoutDeleted) {
      console.log("   ", "TAB ++ ADDED");
    } else if (created === 0 && deleted > 0) {
      console.log("   ", "TAB -- ENDED");
    } else if (created > 0 && deleted > 0) {
      console.log("   ", "TAB >> MOVED");
    }
    // const panel = change.dockbox.children[0];
    // console.log("panel", panel);
    const deepestChild = selectDeepestChild(change.dockbox);
    // console.log("deepestChild", deepestChild);

    let activePanelId = "";

    if (!!deepestChild) {
      if (!!deepestChild.id) {
        // Could be a panel. Take the ID directly.
        activePanelId = deepestChild.id;
      } else if (!!deepestChild.activeId) {
        // Could be a tab. Find its parent, then take the ID.
        const activeTab = this.dockLayout.find(deepestChild.activeId);
        console.log("activeTab", deepestChild.activeId, activeTab);
        const activePanel = activeTab.parent;
        const { id } = activePanel;
        activePanelId = id;
      }
    }

    const newState = {
      layout
    };

    if (!!activePanelId) {
      newState.activePanelId = activePanelId;
    }

    this.setState(() => newState);

    // this.setState(() => ({
    //   layout
    // }));
  };

  loadTab = tabStub => {
    const { id } = tabStub;
    const tabData = {
      ...tabStub,
      title: id,
      closable: true,
      content: <div>{id}</div>,
      group: "closeAll"
    };
    return tabData;
  };

  handleAfterPanelLoaded = (savedPanel, panel) => {
    // console.log(savedPanel, savedPanel.id, panel);
    // this.setState(() => ({
    //   activePanelId: savedPanel.id
    // }));
  };

  render() {
    const style = {
      position: "absolute",
      left: 10,
      top: 60,
      right: 10,
      bottom: 10
    };

    console.log("render", "-----");
    console.log("");

    return (
      <div>
        <DockLayout
          // defaultLayout={layout}
          // dropMode="edge"
          loadTab={this.loadTab}
          layout={this.state.layout}
          onLayoutChange={this.handleLayoutChange}
          afterPanelLoaded={this.handleAfterPanelLoaded}
          ref={this.getRef}
          style={style}
          groups={groups}
        />
        <div className="top-panel">
          <button onClick={this.handleAddTabButtonClick}>Add</button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");

ReactDOM.render(<Root />, rootElement);
