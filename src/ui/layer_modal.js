import React from "react";
import LayerConfig from "../panel/layer_config";

export default ({onCancel, onSubmit}) => (
  <div
    className="absolute absolute--fill bg-black-50 pa4"
    style={{
      zIndex: 998
    }}
  >
    <div
      className="bg-white pa3 flex"
      style={{
        zIndex: 999
      }}
    >
      <LayerConfig onCancel={onCancel} onSubmit={onSubmit}/>
    </div>
  </div>
);