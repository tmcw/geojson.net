import React from "react";

class LayerSwitch extends React.Component {

  render() {
    const { layers, layer, setLayer } = this.props;
    return (
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
    )
  }
}

export default LayerSwitch;