import parse from "./magic_file";

describe("magicFile", () => {
  test("geojson", () => {
    expect(
      parse(JSON.stringify({ type: "Point", coordinates: [0, 0] }))
    ).toEqual({
      type: "Point",
      coordinates: [0, 0]
    });
  });

  test("kml", () => {
    expect(
      parse(`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Simple placemark</name>
    <description>Attached to the ground. Intelligently places itself 
       at the height of the underlying terrain.</description>
    <Point>
      <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
    </Point>
  </Placemark>
</kml>`)
    ).toMatchSnapshot();
  });

  test("gpx", () => {
    expect(
      parse(`<?xml version="1.0"?>
<gpx version="1.1" creator="GDAL 1.11.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogr="http://osgeo.org/gdal" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata><bounds minlat="10.228889000000001" minlon="-1.524722000000000" maxlat="13.520000000000000" maxlon="4.196806000000000"/></metadata>                   
<trk>
  <type>NC</type>
  <trkseg>
    <trkpt lat="10.228889" lon="2.665278">
    </trkpt>
    <trkpt lat="11.133333" lon="2.933333">
    </trkpt>
  </trkseg>
</trk>
</gpx>`)
    ).toMatchSnapshot();
  });

  // TODO: this doesn't run correctly in jest env
  test("osm", () => {
    expect(
      parse(`<osm><node id='1' lat='1.234' lon='4.321' /></osm>`)
    ).toMatchSnapshot();
  });

  test("gtfs", () => {
    expect(
      parse(`shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled
A_shp,37.61956,-122.48161,1,0
A_shp,37.64430,-122.41070,2,6.8310
A_shp,37.65863,-122.30839,3,15.8765`)
    ).toMatchSnapshot();

    expect(
      parse(`stop_id,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station
100014,"BEDFORD PK BL/GRAND CONCOURSE",,  40.872562, -73.888153,,,0,
100017,"PAUL AV/W 205 ST",,  40.876808, -73.889656,,,0,
100018,"PAUL AV/W MOSHOLU PY S",,  40.880341, -73.886063,,,0,
100019,"GRAND CONCOURSE/E 138 ST",,  40.813496, -73.929489,,,0,
100020,"GRAND CONCOURSE/E 144 ST",,  40.816803, -73.927956,,,0,`)
    ).toMatchSnapshot();
  });
});
