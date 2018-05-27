import React from "react";
import L from "leaflet";
import keybinding from "../../lib/d3.keybinding";
import shpwrite from "shp-write";
import wkx from "wkx";
import clone from "clone";
import geojson2dsv from "geojson2dsv";
import togpx from "togpx";
import polyline from "@mapbox/polyline";
import topojson from "topojson";
import { saveAs } from "file-saver";
import tokml from "tokml";
import githubBrowser from "./file_browser.js";
import gistBrowser from "@mapbox/gist-map-browser";
import geojsonNormalize from "geojson-normalize";
import wellknown from "wellknown";
import config from "../config.js";
import readFile from "../lib/readfile";
import geojsonRandom from "geojson-random";
import geojsonExtent from "geojson-extent";
import geojsonFlatten from "geojson-flatten";

export default class FileBar extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }
  blindImport = () => {
    this.fileInputRef.current.click();
  };
  onFileInputChange = e => {
    const { setGeojsonObject } = this.props;
    const { files } = e.target;
    if (!(files && files[0])) return;
    readFile.readAsText(files[0], function(err, text) {
      const result = readFile.readFile(files[0], text);
      if (result instanceof Error) {
      } else {
        setGeojsonObject(result);
      }
      if (files[0].path) {
        // context.data.set({
        //   path: files[0].path
        // });
      }
    });
  };
  downloadTopo = () => {
    const { geojsonObject } = this.props;
    var content = JSON.stringify(
      topojson.topology(
        {
          collection: clone(geojsonObject)
        },
        {
          "property-transform": function(properties, key, value) {
            properties[key] = value;
            return true;
          }
        }
      )
    );

    this.download(content, "map.topojson", "text/plain;charset=utf-8");
  };

  download = (content, filename, type) => {
    saveAs(
      new Blob([content], {
        type
      }),
      filename
    );
  };

  downloadGPX = () => {
    const { geojsonObject } = this.props;
    this.download(
      togpx(geojsonObject, {
        creator: "geojson.net"
      }),
      "map.gpx",
      "text/xml;charset=utf-8"
    );
  };

  downloadGeoJSON = () => {
    const { geojsonObject } = this.props;
    this.download(
      JSON.stringify(geojsonObject, null, 2),
      "map.geojson",
      "text/plain;charset=utf-8"
    );
  };

  downloadDSV = () => {
    const { geojsonObject } = this.props;
    this.download(
      geojson2dsv(geojsonObject),
      "points.csv",
      "text/plain;charset=utf-8"
    );
  };

  downloadKML = () => {
    const { geojsonObject } = this.props;
    this.download(tokml(geojsonObject), "map.kml", "text/plain;charset=utf-8");
  };

  downloadShp = () => {
    d3.select(".map").classed("loading", true);
    try {
      shpwrite.download(context.data.get("map"));
    } finally {
      d3.select(".map").classed("loading", false);
    }
  };

  downloadWKT = () => {
    const { geojsonObject } = this.props;
    var features = geojsonObject.features;
    if (features.length === 0) return;
    var content = features.map(wellknown.stringify).join("\n");
    this.download(
      content,
      "map.wkt",
      "text/plain;charset=utf-8"
    );
  };

  render() {
    const { setGeojsonObject } = this.props;
    const exportFormats = [
      {
        title: "GeoJSON",
        action: this.downloadGeoJSON
      },
      {
        title: "TopoJSON",
        action: this.downloadTopo
      },
      {
        title: "GPX",
        action: this.downloadGPX
      },
      {
        title: "CSV",
        action: this.downloadDSV
      },
      {
        title: "KML",
        action: this.downloadKML
      },
      {
        title: "WKT",
        action: this.downloadWKT
      }
    ];
    var actions = [
      {
        title: "Save",
        children: exportFormats
      },
      {
        title: "New",
        action: function() {
          window.open(
            window.location.origin + window.location.pathname + "#new"
          );
        }
      },
      {
        title: "Meta",
        action: function() {},
        children: [
          {
            title: "Clear",
            alt: "Delete all features from the map",
            action: () => {
              if (
                confirm(
                  "Are you sure you want to delete all features from this map?"
                )
              ) {
                setGeojsonObject({ type: "FeatureCollection", features: [] });
              }
            }
          },
          {
            title: "Random: Points",
            alt: "Add random points to your map",
            action: () => {
              const { setGeojsonObject, geojsonObject } = this.props;
              var response = prompt("Number of points (default: 100)");
              if (response === null) return;
              var count = parseInt(response, 10);
              if (isNaN(count)) count = 100;
              const fc = geojsonNormalize(geojsonObject);
              fc.features.push.apply(
                fc.features,
                geojsonRandom(count, "point").features
              );
              setGeojsonObject(fc);
            }
          },
          {
            title: "Add bboxes",
            alt: "Add bounding box members to all applicable GeoJSON objects",
            action: () => {
              const { setGeojsonObject, geojsonObject } = this.props;
              setGeojsonObject(geojsonExtent.bboxify(geojsonObject));
            }
          },
          {
            title: "Flatten Multi Features",
            alt:
              "Flatten MultiPolygons, MultiLines, and GeometryCollections into simple geometries",
            action: () => {
              const { setGeojsonObject, geojsonObject } = this.props;
              setGeojsonObject(geojsonFlatten(geojsonObject));
            }
          },
          // https://developers.google.com/maps/documentation/utilities/polylinealgorithm
          {
            title: "Load encoded polyline",
            alt:
              "Decode and show an encoded polyline. Precision 5 is supported.",
            action: () => {
              const { setGeojsonObject } = this.props;
              const input = prompt("Enter your polyline");
              try {
                const decoded = polyline.toGeoJSON(input);
                setGeojsonObject(decoded);
              } catch (e) {
                alert("Sorry, we were unable to decode that polyline");
              }
            }
          },
          {
            title: "Load WKB Base64 Encoded String",
            alt: "Decode and show WKX data",
            action: () => {
              const input = prompt("Enter your Base64 encoded WKB/EWKB");
              try {
                // TODO: base64 in browser
                var decoded = wkx.Geometry.parse(Buffer.from(input, "base64"));
                setGeojsonObject(decoded.toGeoJSON());
                // zoomextent(context); TODO
              } catch (e) {
                console.error(e);
                alert(
                  "Sorry, we were unable to decode that Base64 encoded WKX data"
                );
              }
            }
          },
          {
            title: "Load WKB Hex Encoded String",
            alt: "Decode and show WKX data",
            action: function() {
              const input = prompt("Enter your Hex encoded WKB/EWKB");
              try {
                var decoded = wkx.Geometry.parse(Buffer.from(input, "hex"));
                setGeojsonObject(decoded.toGeoJSON());
                // zoomextent(context); TODO
              } catch (e) {
                console.error(e);
                alert(
                  "Sorry, we were unable to decode that Hex encoded WKX data"
                );
              }
            }
          },
          {
            title: "Load WKT String",
            alt: "Decode and show WKX data",
            action: function() {
              const input = prompt("Enter your WKT/EWKT String");
              try {
                var decoded = wkx.Geometry.parse(input);
                setGeojsonObject(decoded.toGeoJSON());
                // zoomextent(context); TODO
              } catch (e) {
                console.error(e);
                alert("Sorry, we were unable to decode that WKT data");
              }
            }
          }
        ]
      }
    ];

    actions.unshift({
      title: "Open",
      children: [
        {
          title: "File",
          alt: "GeoJSON, TopoJSON, GTFS, KML, CSV, GPX and OSM XML supported",
          action: this.blindImport
        },
        {
          title: "GitHub",
          alt: "GeoJSON files in GitHub Repositories",
          authenticated: true,
          action: this.props.toggleGithubModal
        },
        {
          title: "Gist",
          alt: "GeoJSON files in GitHub Gists",
          authenticated: true,
          action: () => {}
        }
      ]
    });

    return (
      <div className="inline-flex">
        {actions.map((item, i) => {
          return (
            <div
              key={i}
              style={{ zIndex: 999 }}
              onClick={item.action}
              className="db bn pv1 ph2 br2 br--top outline-0 disappear-child relative pointer black-50 hover-black f6"
            >
              {item.title}
              {item.children ? (
                <div
                  className="child bg-white absolute w4"
                  style={{
                    top: 24
                  }}
                >
                  {item.children.map((child, i) => {
                    return (
                      <div
                        onClick={child.action}
                        key={i}
                        className={`bn pv1 ph2 outline-0 tl f6 db hover-bg-blue hover-white w-100 pointer`}
                      >
                        {child.title}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
        <input
          type="file"
          className="dn"
          ref={this.fileInputRef}
          onChange={this.onFileInputChange}
        />
      </div>
    );
  }
}
