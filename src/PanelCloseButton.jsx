import React from "react";

export default function PanelCloseButton({
  onClosePanelButtonClick,
  ...props
}) {
  return (
    <div
      className="my-panel-close-btn"
      onClick={onClosePanelButtonClick}
      style={props.style}
    >
      X
    </div>
  );
}
