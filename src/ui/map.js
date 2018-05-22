import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import "leaflet-editable";
import marker from "../map/marker";
import { layers } from "../layers";
import geojsonRewind from "geojson-rewind";
import simplestyle from "./simplestyle";
var makiValues = require("../../data/maki.json");
import LGeo from "leaflet-geodesy";

let maki = "";
for (var i = 0; i < makiValues.length; i++) {
  maki += '<option value="' + makiValues[i].icon + '">';
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    let mapLayer = L.featureGroup();
    let map = new L.Map(this.mapRef.current, {
      editable: true,
      editOptions: {
        featuresLayer: mapLayer
      }
    });
    const { layer } = this.props;
    L.control
      .scale()
      .setPosition("bottomright")
      .addTo(map);
    map.zoomControl.setPosition("topright");
    // L.hash(map);
    const metric =
      navigator.language !== "en-us" && navigator.language !== "en-US";
    map.setView([20, 0], 2);

    map.attributionControl.setPrefix(
      '<a target="_blank" href="http://geojson.net/about.html">About</a>'
    );

    map.removeLayer(mapLayer);
    const baseLayerGroup = L.layerGroup().addTo(map);
    map.addLayer(mapLayer);
    layers.find(({ id }) => id === layer).layer.addTo(baseLayerGroup);
    map.on("editable:drawing:commit", this.updateFromMap);
    map.on("layeradd", this.onLayerAdd);
    this.setState({
      map,
      baseLayerGroup,
      mapLayer
    });
  }
  createFromMap = e => {
    const { mapLayer } = this.state;
    mapLayer.addLayer(e.layer);
    this.updateFromMap();
  };
  onLayerAdd = e => {
    const { layer } = e;
    if ("bindPopup" in layer) {
      layer.bindPopup(
        L.popup(
          {
            closeButton: false,
            maxWidth: 500,
            maxHeight: 400,
            autoPanPadding: [5, 45],
            classname: "geojsonnet-feature"
          },
          layer
        ).setContent(this.makePopup(layer))
      );
    }
  };
  makePopup = layer => {
    const div = document.createElement("div");
    const popup = ReactDOM.render(<div>Layer</div>, div);
    div.className = "ispopup";
    return div;
  };
  updateFromMap = () => {
    const { setGeojson } = this.props;
    const { mapLayer } = this.state;
    let geojson = geojsonRewind(mapLayer.toGeoJSON());
    setGeojson(geojson);
  };
  componentDidUpdate(prevProps, prevState) {
    console.log("map -> componentDidUpdate");
    const { layer, geojson } = this.props;
    const { baseLayerGroup, mapLayer, map } = this.state;
    if (prevProps.layer !== layer) {
      baseLayerGroup
        .clearLayers()
        .addLayer(layers.find(({ id }) => id === layer).layer);
    }
    geojsonToLayer(geojson, mapLayer);
  }
  startLine = () => {
    const { map } = this.state;
    map.editTools.startPolyline();
  };
  startPolygon = () => {
    const { map } = this.state;
    map.editTools.startPolygon();
  };
  startRectangle = () => {
    const { map } = this.state;
    map.editTools.startRectangle();
  };
  startMarker = () => {
    const { map } = this.state;
    map.editTools.startMarker();
  };
  render() {
    return (
      <div className="flex-auto flex">
        <div className="flex-auto" ref={this.mapRef} />
        <div className="bl b--black-10 bg-silver flex flex-column">
          <button
            className="bg-white pa2 b--black-10 bb tl"
            onClick={this.startLine}
          >
            line
          </button>
          <button
            className="bg-white pa2 b--black-10 bb tl"
            onClick={this.startPolygon}
          >
            polygon
          </button>
          <button
            className="bg-white pa2 b--black-10 bb tl"
            onClick={this.startRectangle}
          >
            rectangle
          </button>
          <button
            className="bg-white pa2 b--black-10 bb tl"
            onClick={this.startMarker}
          >
            marker
          </button>
        </div>
      </div>
    );
  }
}
function layerToGeoJSON(layer) {
  var features = [];
  layer.eachLayer(collect);
  function collect(l) {
    if ("toGeoJSON" in l) features.push(l.toGeoJSON());
  }
  return {
    type: "FeatureCollection",
    features: features
  };
}

function geojsonToLayer(geojson, layer) {
  layer.clearLayers();
  L.geoJson(geojson, {
    style: simplestyle,
    pointToLayer: function(feature, latlon) {
      if (!feature.properties) feature.properties = {};
      return marker.style(feature, latlon);
    }
  }).eachLayer(add);

  function add(l) {
    // bindPopup(l);
    l.addTo(layer);
  }
}
