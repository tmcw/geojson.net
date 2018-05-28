import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import "leaflet-editable";
import marker from "../map/marker";
import { layers } from "../layers";
import Popup from "./popup";
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
    mapLayer.on("layeradd", this.onLayerAdd);

    L.EditControl = L.Control.extend({
      options: {
        position: "topleft",
        callback: null,
        kind: "",
        html: ""
      },

      onAdd: function(map) {
        var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
          link = L.DomUtil.create("a", "", container);

        link.href = "#";
        link.title = "Create a new " + this.options.kind;
        link.innerHTML = this.options.html;
        L.DomEvent.on(link, "click", L.DomEvent.stop).on(
          link,
          "click",
          function() {
            window.LAYER = this.options.callback.call(map.editTools);
          },
          this
        );

        return container;
      }
    });

    L.NewLineControl = L.EditControl.extend({
      options: {
        position: "topright",
        callback: map.editTools.startPolyline,
        kind: "line",
        html: "\\/\\"
      }
    });

    L.NewPolygonControl = L.EditControl.extend({
      options: {
        position: "topright",
        callback: map.editTools.startPolygon,
        kind: "polygon",
        html: "▰"
      }
    });

    L.NewMarkerControl = L.EditControl.extend({
      options: {
        position: "topright",
        callback: map.editTools.startMarker,
        kind: "marker",
        html: "🖈"
      }
    });

    L.NewRectangleControl = L.EditControl.extend({
      options: {
        position: "topright",
        callback: map.editTools.startRectangle,
        kind: "rectangle",
        html: "⬛"
      }
    });

    map.addControl(new L.NewMarkerControl());
    map.addControl(new L.NewLineControl());
    map.addControl(new L.NewPolygonControl());
    map.addControl(new L.NewRectangleControl());

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
  popupRemoveLayer = layer => {
    const { setGeojsonObject } = this.props;
    const { mapLayer } = this.state;
    mapLayer.removeLayer(layer);
    let geojson = geojsonRewind(mapLayer.toGeoJSON());
    setGeojsonObject(geojson);
  };
  editProperties = properties => {
    console.log(properties);
  };
  makePopup = layer => {
    const { setGeojsonObject } = this.props;
    const div = document.createElement("div");
    const popup = ReactDOM.render(
      <Popup
        layer={layer}
        editProperties={this.editProperties}
        setGeojsonObject={setGeojsonObject}
        popupRemoveLayer={this.popupRemoveLayer}
      />,
      div
    );
    div.className = "ispopup";
    return div;
  };
  updateFromMap = () => {
    const { setGeojsonObject } = this.props;
    const { mapLayer } = this.state;
    let geojson = geojsonRewind(mapLayer.toGeoJSON());
    setGeojsonObject(geojson);
  };
  componentDidUpdate(prevProps, prevState) {
    const { layer, geojson } = this.props;
    const { baseLayerGroup, mapLayer, map } = this.state;
    if (prevProps.layer !== layer) {
      baseLayerGroup
        .clearLayers()
        .addLayer(layers.find(({ id }) => id === layer).layer);
    }
    geojsonToLayer(JSON.parse(geojson), mapLayer);
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
    return <div className="flex-auto" ref={this.mapRef} />;
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
