import ReactJson from "react-json-view";
import React from "react";
import { geometry as geometryArea } from "@mapbox/geojson-area";

export default class Popup extends React.Component {
  render() {
    const { layer, editProperties, popupRemoveLayer } = this.props;
    const { properties } = layer.toGeoJSON();
    return (
      <div>
        <ReactJson
          name="properties"
          displayDataTypes={false}
          onEdit={editProperties}
          onAdd={editProperties}
          onDelete={editProperties}
          enableClipboard={false}
          src={properties}
        />
        <Metadata layer={layer} />
        <button onClick={() => popupRemoveLayer(layer)}>Delete feature</button>
      </div>
    );
  }
}

const Metadata = ({ layer }) => {
  const { geometry } = layer.toGeoJSON();
  if (geometry.type === "Point") {
    const {
      coordinates: [latitude, longitude]
    } = geometry;
    return (
      <Table
        obj={{
          Latitude: latitude.toFixed(4),
          Longitude: longitude.toFixed(4)
        }}
      />
    );
  } else if (geometry.type === "Polygon") {
    const area = geometryArea(geometry);
    return (
      <Table
        obj={{
          "Sq. Meters": area.toFixed(2),
          "Sq. Kilometers": (area / 1000000).toFixed(2),
          "Sq. Feet": (area / 0.092903).toFixed(2),
          Acres: (area / 4046.86).toFixed(2),
          "Sq. Miles": (area / 2589990).toFixed(2)
        }}
      />
    );
  } else if (geometry.type === "LineString") {
    const { coordinates } = geometry;
    let total = 0;
    for (var i = 0; i < coordinates.length - 1; i++) {
      const a = coordinates[i];
      const b = coordinates[i + 1];
      total += L.latLng(a[1], a[0]).distanceTo(L.latLng(b[1], b[0]));
    }
    return (
      <Table
        obj={{
          Meters: total.toFixed(2),
          Kilometers: (total / 1000).toFixed(2),
          Feet: (total / 0.3048).toFixed(2),
          Yards: (total / 0.9144).toFixed(2),
          Miles: (total / 1609.34).toFixed(2)
        }}
      />
    );
  }
  return null;
};

const Table = ({ obj }) => {
  return (
    <table>
      <tbody>
        {Object.entries(obj).map(([key, value], i) => {
          return (
            <tr key={i}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
