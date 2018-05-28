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
    const featuresLayer = L.layerGroup();
    let map = new L.Map(this.mapRef.current, {
      editable: true,
      editOptions: {
        featuresLayer
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

    map.attributionControl.setPrefix("");

    const baseLayerGroup = L.layerGroup().addTo(map);
    layers.find(({ id }) => id === layer).layer.addTo(baseLayerGroup);
    // map.on("editable:drawing:commit", this.updateFromMap);

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
    map.addLayer(featuresLayer);

    map
      .on("editable:dragend", this.updateFromMap)
      .on("editable:created", this.updateFromMap)
      .on("editable:drawing:commit", this.ensureMapIsGeoJSON)
      .on("editable:editing", this.updateFromMap);

    this.setState({
      map,
      baseLayerGroup
    });
  }
  bindLayerPopup = layer => {
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
    const { setGeojson } = this.props;
    const { mapLayer } = this.state;
    mapLayer.removeLayer(layer);
    let geojson = geojsonRewind(mapLayer.toGeoJSON());
    setGeojson(geojson, "map");
  };
  editProperties = (update, layer) => {
    layer.feature.properties = update.updated_src;
    this.updateFromMap();
  };
  makePopup = layer => {
    const { setGeojson } = this.props;
    const div = document.createElement("div");
    const popup = ReactDOM.render(
      <Popup
        layer={layer}
        editProperties={update => this.editProperties(update, layer)}
        setGeojson={setGeojson}
        popupRemoveLayer={this.popupRemoveLayer}
      />,
      div
    );
    div.className = "ispopup";
    return div;
  };
  ensureMapIsGeoJSON = e => {
    const {
      map: {
        editTools: { featuresLayer }
      }
    } = this.state;
    const geojson = featuresLayer.toGeoJSON();
    featuresLayer.clearLayers();
    console.log(featuresLayer, geojson);
    L.geoJson(geojson).eachLayer(layer => {
      featuresLayer.addLayer(layer);
      // layer must be added before editing can be enabled.
      layer.enableEdit();
    });
    this.updateFromMap(e);
  };
  updateFromMap = () => {
    const {
      map: {
        editTools: { featuresLayer }
      }
    } = this.state;
    const { setGeojson } = this.props;
    let geojson = geojsonRewind(featuresLayer.toGeoJSON());
    setGeojson(geojson, "map");
    featuresLayer.eachLayer(this.bindLayerPopup);
  };
  componentDidUpdate(prevProps, prevState) {
    const { geojson, changeFrom } = this.props;
    if (geojson !== prevProps.geojson && changeFrom !== "map") {
      const {
        map: {
          editTools: { featuresLayer }
        }
      } = this.state;
      featuresLayer.clearLayers();
      L.geoJson(geojson).eachLayer(layer => {
        featuresLayer.addLayer(layer);
        // layer must be added before editing can be enabled.
        layer.enableEdit();
      });
    }
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
