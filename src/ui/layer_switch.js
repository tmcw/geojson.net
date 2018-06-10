import React from "react";

export default ({ layer, layers, setLayer }) => (
  <div className="flex">
    {layers.map(({ id, title }) => (
      <span
        key={id}
        onClick={() => setLayer(id)}
        className={`db pointer bn pa2 nowrap outline-0 ${layer === id
          ? "bg-yellow"
          : ""}`}
      >
        {title}
      </span>
    ))}
  </div>
);
