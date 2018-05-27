import Table from "../src/panel/table";
import React from "react";
import { storiesOf } from "@storybook/react";

const geojsonFixture = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { hi: "Tom", hello: "John" },
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    },
    {
      type: "Feature",
      properties: { hi: "Ted", nope: "John" },
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  ]
};

storiesOf("Table", module).add("default", () => (
  <div className="sans-serif pa4">
    <Table geojsonObject={geojsonFixture} />
  </div>
));
