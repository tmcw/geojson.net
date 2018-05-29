import toGeoJSON from "@mapbox/togeojson";
import osmtogeojson from "osmtogeojson";
import gtfs2geojson from "gtfs2geojson";

const geojsonTypes = new Set([
  "Point",
  "Polygon",
  "LineString",
  "MultiPoint",
  "MultiPolygon",
  "MultiLineString",
  "GeometryCollection",
  "Feature",
  "FeatureCollection"
]);

export default function parse(text) {
  try {
    const parsed = JSON.parse(text);
    if (geojsonTypes.has(parsed.type)) {
      return parsed;
    }
  } catch (e) {}

  if (text.indexOf("shape_id,shape_pt_lat,shape_pt_lon") !== -1) {
    return gtfs2geojson.lines(text);
  } else if (
    text.indexOf(
      "stop_id,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station"
    ) !== -1
  ) {
    return gtfs2geojson.stops(text);
  }

  try {
    const xml = new DOMParser().parseFromString(text, "text/xml");
    if (text.indexOf("<kml") !== -1) return toGeoJSON.kml(xml);
    if (text.indexOf("<gpx") !== -1) return toGeoJSON.gpx(xml);
    if (text.indexOf("<osm") !== -1) return osmtogeojson(xml);
  } catch (e) {}
}
