import React from "react";

export default class Popup extends React.Component {
  render() {
    const { layer, popupRemoveLayer } = this.props;
    return (
      <div>
        I am a popup.
        <button onClick={() => popupRemoveLayer(layer)}>Delete feature</button>
      </div>
    );
  }
}
