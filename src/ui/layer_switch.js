import React from "react";
import L from "leaflet";
import { layers } from "../layers";

export default ({ layer, setLayer }) => (
  <div className="bt">
    {layers.map(({ id, title }) => (
      <button
        key={id}
        onClick={() => setLayer(id)}
        className={`pointer bn pa2 outline-0 ${
          layer === id ? "bg-light-yellow" : ""
        }`}
      >
        {title}
      </button>
    ))}
  </div>
);
