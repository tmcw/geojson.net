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
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import Dropzone from "react-dropzone";
import magicFile from "./lib/magic_file";

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
    githubModal: false,
    geojson: initialGeojson,
    changeFrom: undefined,
    dropzoneActive: false,
    showPanel: true
  };
  togglePanel = () => {
    this.setState(({ showPanel }) => ({
      showPanel: !showPanel
    }));
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
    this.setState({ geojson, changeFrom });
  };
  onDragEnter = () => {
    this.setState({
      dropzoneActive: true
    });
  };
  onDragLeave = () => {
    this.setState({
      dropzoneActive: false
    });
  };
  onDrop = files => {
    this.setState({
      dropzoneActive: false
    });
    this.importFiles(files);
  };
  importFiles = files => {
    const { setGeojson } = this;
    const [file] = files;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load", () => {
      setGeojson(magicFile(reader.result));
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
      githubModal,
      accept,
      files,
      dropzoneActive,
      showPanel
    } = this.state;
    const { setGeojson, setLayer, setMode, togglePanel } = this;
    return (
      <ApolloProvider client={client}>
        <Dropzone
          disableClick
          style={{ position: "relative" }}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          <div className="f6 sans-serif fw6">
            <div className="vh-100 flex">
              <div
                className={`w-${showPanel ? "50" : "100"} flex flex-column z-0`}
              >
                <div className="bg-white flex justify-between bb">
                  <FileBar
                    geojson={geojson}
                    geojsonObject={geojsonObject}
                    setGeojson={setGeojson}
                    toggleGithubModal={this.toggleGithubModal}
                  />
                </div>
                <Map
                  layer={layer}
                  geojson={geojson}
                  setGeojson={setGeojson}
                  changeFrom={changeFrom}
                  showPanel={showPanel}
                />
                <div className="flex justify-between bt">
                  <LayerSwitch layer={layer} setLayer={setLayer} />
                  <span onClick={this.togglePanel}>
                    {showPanel ? "▷" : "◁"}
                  </span>
                </div>
              </div>
              {showPanel && (
                <div className="w-50 bl flex flex-column">
                  <div
                    className="bg-white flex justify-between bb"
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
              )}
              {/*githubModal && <GithubModal /> */}
            </div>
          </div>
          {dropzoneActive && (
            <div
              className="absolute absolute--fill bg-black-20 flex items-center justify-center"
              style={{
                zIndex: 999
              }}
            >
              <div className="sans-serif bg-white pa2 ba">
                Drop files to import
              </div>
            </div>
          )}
        </Dropzone>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("geojsonnet"));
