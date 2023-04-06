import React, {Component} from "react";
import {DockLayout} from "rc-dock";
import {detailedDiff} from "deep-object-diff";

import "rc-dock/dist/rc-dock.css";

import {getTab} from "./tab";
import {createTabGroups} from "./TabGroups";
import {selectLayoutDockBox} from "./utils";

import "./App.css";

import layout from "./layout.json";
import {normalizeLayout} from "./root.models";

export default class App extends Component {
    state = {
        activePanelId: "",
        layout: layout
    };

    count = 0;

    componentDidMount() {
        const layoutData = localStorage.getItem("myLayout")

        if(layoutData){
            this.setState({
                layout: JSON.parse(layoutData),
            });
        }
    }

    ref = a => {
        this.dockLayout = a;
    };

    loadTab = tab => {
        const {id} = tab;
        const tabData = {
            ...tab,
            title: id,
            closable: true,
            content: <div>{id}</div>,
            group: "closeAll"
        };

        return tabData;
    };

    addTab = panelId => {
        const panelData = this.dockLayout.find(panelId);
        ++this.count;
        const newTabId = `tab${this.count}`;
        const newTab = getTab(newTabId);

        this.dockLayout.dockMove(newTab, panelData, "middle");
    };

    handleAddTabButtonClick = () => {
        // The <DockLayout> layout state is not identical to the controlling component.
        const {children} = selectLayoutDockBox(this.dockLayout.state.layout);

        // Find a panel to add the new tab to.
        const [child] = children;
        const {id, tabs} = child;
        const isLastPanel = children.length === 1 && tabs.length === 0;

        if (isLastPanel) {
            // If no `layout.dockbox` panels exist, create one first.
            // Otherwise, tab appends won't work.
            this.setState(
                () => ({
                    activePanelId: id,
                    layout: {
                        ...this.state.layout, // Preserve any existing tabs in `layout.floatbox`.
                        layout // Overwrite the `layout.dockbox` tabs setup only.
                    }
                }),
                () => {
                    this.addTab(id);
                }
            );

            return;
        }

        const {activePanelId} = this.state;

        this.addTab(activePanelId);
    };

    handleLayoutChange = newLayout => {
        const a = normalizeLayout(this.state.layout);
        const b = normalizeLayout(newLayout);
        const changes = detailedDiff(a, b);

        const newState = {
            layout: newLayout
        };

        this.setState(() => newState);

        localStorage.setItem("myLayout", JSON.stringify(newLayout));
    };

    handlePanelLoaded = (savedPanel, loadedPanel) => {
        // console.log(savedPanel, loadedPanel);
        const {id} = savedPanel;

        this.setState(() => ({
            activePanelId: id
        }));
    };

    handleLoadLayout = () => {
        const savedLayout = JSON.parse(localStorage.getItem("myLayout"));
        this.setState(() => ({
            layout: {
                ...savedLayout
            }
        }))
    }

    handleResetLayout = () => {
        this.setState(() => ({
            layout: {
                ...layout
            }
        }))
    }

    render() {
        const {layout} = this.state;
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
                    loadTab={this.loadTab}
                    layout={layout}
                    onLayoutChange={this.handleLayoutChange}
                    afterPanelLoaded={this.handlePanelLoaded}
                    ref={this.ref}
                    style={style}
                    groups={createTabGroups()}
                />
                <div className="top-panel">
                    <button onClick={this.handleAddTabButtonClick}>Add</button>
                    <button onClick={this.handleSaveLayout}>Save</button>
                    <button onClick={this.handleLoadLayout}>Load</button>
                    <button onClick={this.handleResetLayout}>Reset</button>
                </div>
            </div>
        );
    }
}
