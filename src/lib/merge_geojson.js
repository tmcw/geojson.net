import normalize from "@mapbox/geojson-normalize";

export default function merge(inputs) {
  var output = {
    type: "FeatureCollection",
    features: []
  };
  for (var i = 0; i < inputs.length; i++) {
    var normalized = normalize(inputs[i]);
    for (var j = 0; j < normalized.features.length; j++) {
      output.features.push(normalized.features[j]);
    }
  }
  return output;
}
