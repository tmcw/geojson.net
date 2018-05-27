import querystring from "querystring";
import React from "react";
import ReactDOM from "react-dom";
import Help from "./panel/help";
import LayerSwitch from "./ui/layer_switch";
import FileBar from "./ui/file_bar";
import User from "./ui/user";
import Map from "./ui/map";
import GithubModal from "./ui/github_modal";
import Panel from "./panel/index";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import { Row, Col, Button, Tabs, Menu, Dropdown, Icon, Table, List, Avatar, Badge, Card, Tooltip } from 'antd';
import './App.css';

const { access_token } = querystring.parse(location.search.replace(/^\?/, ""));

console.log(access_token);

if (access_token) {
  localStorage.setItem("githubToken", access_token);
  location.replace("/");
}

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: `bearer ${localStorage.getItem("githubToken")}`
    }
  });
  return forward(operation);
});

let httpLink = middlewareLink.concat(
  createHttpLink({ uri: "https://api.github.com/graphql" })
);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

// networkInterface.use([
//   {
//     applyMiddleware(req, next) {
//       if (!req.options.headers) {
//         req.options.headers = {}; // Create the header object if needed.
//       }
//
//       // Send the login token in the Authorization header
//       req.options.headers.authorization = `Bearer ${TOKEN}`;
//       next();
//     }
//   }
// ]);
class App extends React.Component {
  state = {
    mode: "code",
    layer: "mapbox",
    githubModal: false,
    geojson: { type: "FeatureCollection", features: [] }
  };
  setMode = mode => {
    this.setState({ mode });
  };
  toggleGithubModal = () => {
    this.setState({ githubModal });
  };
  setLayer = layer => {
    this.setState({ layer });
  };
  setGeojson = geojson => {
    this.setState({ geojson });
  };
  render() {
    const { geojson, layer, map, mode, githubModal } = this.state;
    const { setGeojson, setLayer, setMode } = this;
    return (
      <ApolloProvider client={client}>
          <Row className="container">
            <Col span={16} className="mapArea">
              <FileBar
                geojson={geojson}
                setGeojson={setGeojson}
                toggleGithubModal={this.toggleGithubModal}
              />
              <Map layer={layer} geojson={geojson} setGeojson={setGeojson} />
            </Col>

            <Col span={8} className="sidebar">
  <User />
            <Panel mode={mode} geojson={geojson} setGeojson={setGeojson} />
          {githubModal && <GithubModal />}
          </Col>
          </Row>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("geojsonio"));

// <div className="bg-white pt2 ph2 flex justify-between">

// </div>
 // <LayerSwitch layer={layer} setLayer={setLayer} />
