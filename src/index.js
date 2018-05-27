import querystring from "querystring";
import React from "react";
import ReactDOM from "react-dom";
import Help from "./panel/help";
import LayerSwitch from "./ui/layer_switch";
import FileBar from "./ui/file_bar";
import ModeButtons from "./ui/mode_buttons";
import User from "./ui/user";
import Map from "./ui/map";
import GithubModal from "./ui/github_modal";
import Panel from "./panel/index";
import ApolloClient from "apollo-client";
import stringify from "json-stringify-pretty-compact";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

const { access_token } = querystring.parse(location.search.replace(/^\?/, ""));

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

const initialGeojson = { type: "FeatureCollection", features: [] };

class App extends React.Component {
  state = {
    mode: "code",
    layer: "mapbox",
    githubModal: true,
    geojson: JSON.stringify(initialGeojson),
    geojsonObject: initialGeojson,
    changeFrom: undefined
  };
  setMode = mode => {
    this.setState({ mode });
  };
  toggleGithubModal = () => {
    this.setState(({ githubModal }) => {
      githubModal: !githubModal;
    });
  };
  setLayer = layer => {
    this.setState({ layer });
  };
  setGeojson = (geojson, changeFrom) => {
    this.setState({ geojson, geojsonObject: JSON.parse(geojson), changeFrom });
  };
  setGeojsonObject = (geojsonObject, changeFrom) => {
    this.setState({
      geojsonObject,
      geojson: stringify(geojsonObject),
      changeFrom
    });
  };
  render() {
    const {
      geojson,
      geojsonObject,
      changeFrom,
      layer,
      map,
      mode,
      githubModal
    } = this.state;
    const { setGeojson, setLayer, setMode, setGeojsonObject } = this;
    return (
      <ApolloProvider client={client}>
        <div className="vh-100 flex sans-serif black-70">
          <div className="w-50 flex flex-column z-0">
            <div className="bg-white pt2 ph2 flex justify-between">
              <FileBar
                geojson={geojson}
                geojsonObject={geojsonObject}
                setGeojson={setGeojson}
                setGeojsonObject={setGeojsonObject}
                toggleGithubModal={this.toggleGithubModal}
              />
            </div>
            <Map
              layer={layer}
              geojson={geojson}
              setGeojson={setGeojson}
              setGeojsonObject={setGeojsonObject}
            />
            <LayerSwitch layer={layer} setLayer={setLayer} />
          </div>
          <div className="w-50 bl b--black-10 bg-light-gray flex flex-column">
            <div
              className="bg-white pt2 ph2 flex justify-between bb b--black-20"
              style={{
                flexShrink: 0
              }}
            >
              <ModeButtons mode={mode} setMode={setMode} />
              <User />
            </div>
            <Panel
              mode={mode}
              geojson={geojson}
              setGeojson={setGeojson}
              changeFrom={changeFrom}
            />
          </div>
          {githubModal && <GithubModal />}
        </div>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("geojsonio"));
