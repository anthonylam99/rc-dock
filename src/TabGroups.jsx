import React from "react";
import PanelCloseButton from "./PanelCloseButton";

const handleClosePanelButtonClick = (panelData, context) => event => {
  context.dockMove(panelData, null, "remove");
};

export const createTabGroups = function createTabGroups() {
  return {
    closeAll: {
      closable: true,
      floatable: true,
      panelExtra: (panelData, context) => {
        return (
          <PanelCloseButton
            onClosePanelButtonClick={handleClosePanelButtonClick(
              panelData,
              context
            )}
          />
        );
      }
    }
  };
};
