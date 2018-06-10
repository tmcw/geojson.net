import React from "react";
import LayerConfig from "../panel/layer_config";

export default ({ onCancel, onSubmit }) => (
  <div
    className="absolute absolute--fill bg-black-50 pa4 flex items-center justify-center"
    style={{
      zIndex: 998
    }}
  >
    <div
      className="bg-white pa3 flex mw6 w-100"
      style={{
        zIndex: 999
      }}
    >
      <LayerConfig onCancel={onCancel} onSubmit={onSubmit} />
    </div>
  </div>
);
