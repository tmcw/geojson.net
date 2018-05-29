[![Circle CI](https://circleci.com/gh/tmcw/geojson.net/tree/gh-pages.svg?style=svg)](https://circleci.com/gh/mapbox/geojson.io/tree/gh-pages)
# geojson.net

_Son of geojson.io_

## Development

First install dependencies: `yarn` is recommended, `npm` should also work: run
`yarn` or `npm install`. Then start the development
server: `yarn start` or `npm start`.

## Thesis

geojson.net is a continuation of geojson.io, and shares most of the same goals:

**Edit GeoJSON.** Editing means adding, removing, and modifying
features, and modifying their geometries and properties. As much as possible, the aim
is to support **all GeoJSON**: all geometry types, all features of the specification.

**Import and export geospatial data.** Common formats like KML,
GPX, WKT, WKB, OSM - these should all be importable into geojson.net, and many
of them should be exportable. And in these import/export processes, try to stay
as _verbatim_ as possible.

**Share geospatial data.** GitHub repositories and gists should be supported,
and potentially ways to share geospatial data.

---

geojson.net share most of the same non-goals:

**It's not a website or endgame for your geospatial data.** geojson.net might work in a pinch
to display a list of locations for end-users, but that is not its primary goal. It is
not primarily a means of presentation - it's a tool for editing data.

**It's not a product or a company.** There is no profit-making incentive involved in this project.
You don't make a geojson.net account or create a subscription. At the same time, this means that there is no professional support, no guarantee or
warranty, and people who have specific strong needs are advised to help out
and become contributors to the codebase. Insisting on features will generally not
work, and any rude behavior is subject to
the [Contributor Covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html).

---

there are also a few non-objective philosophies behind the tool:

**Be useful, simple, and basic.** This application does not aim to reinvent any
UI or UX, or push the limits of the web. We're just solving a simple problem.
