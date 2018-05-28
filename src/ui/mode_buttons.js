import React from "react";

const buttons = [
  {
    mode: "code",
    title: "JSON"
  } /*,
  {
    mode: "table",
    title: "Table"
  } */,
  {
    mode: "help",
    title: "Help"
  }
];

export default ({ mode, setMode }) => (
  <div className="inline-flex">
    {buttons.map((button, i) => (
      <span
        key={i}
        className={`db bn pa2 outline-0 pointer black
                  ${mode == button.mode ? "bg-light-yellow" : ""}`}
        onClick={() => setMode(button.mode)}
      >
        {button.title}
      </span>
    ))}
  </div>
);
