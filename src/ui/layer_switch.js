import React from "react";
import L from "leaflet";
import { layers } from "../layers";

export default ({ layer, setLayer }) => (
  <div className="flex">
    {layers.map(({ id, title }) => (
      <span
        key={id}
        onClick={() => setLayer(id)}
        className={`db pointer bn pa2 nowrap outline-0 ${
          layer === id ? "bg-yellow" : ""
        }`}
      >
        {title}
      </span>
    ))}
  </div>
);
