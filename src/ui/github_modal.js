import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const FILE_QUERY = gql`
  query($repository: ID!) {
    node(id: $repository) {
      ... on Repository {
        object(expression: "master:") {
          ... on Tree {
            entries {
              name
              type
              mode
              object {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const REPO_QUERY = gql`
  query {
    viewer {
      repositories(first: 100) {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }
  }
`;

const TEXT_QUERY = gql`
  query($id: ID!) {
    node(id: $id) {
      ... on Blob {
        id
        text
      }
    }
  }
`;

const Import = ({ id }) => (
  <Query query={TEXT_QUERY} variables={{ id }}>
    {({ loading, error, data }) =>
      loading ? (
        "loading..."
      ) : !data ? (
        "error"
      ) : (
        <div className="flex flex-column">
          <div className="overflow-y-scroll overflow-x-hidden w5 pre code pa2 fw5 flex-auto">
            {data.node.text ? data.node.text : "No files"}
          </div>
          <div
            className="pa2 hover-bg-yellow bt pointer"
            onClick={() => this.props.importFiles(data.node.text)}
          >
            Import
          </div>
        </div>
      )
    }
  </Query>
);

const FileBrowser = ({ repository, clickFile }) => (
  <Query query={FILE_QUERY} variables={{ repository }}>
    {({ loading, error, data }) =>
      loading ? (
        "loading..."
      ) : !data ? (
        "error"
      ) : (
        <div
          style={{
            maxHeight: 320
          }}
          className="overflow-y-scroll overflow-x-hidden w5"
        >
          {data.node.object
            ? data.node.object.entries.map(entry => (
                <div
                  onClick={() => clickFile(entry)}
                  className="bb pointer hover-bg-yellow pa2"
                >
                  {entry.name}
                </div>
              ))
            : "No files"}
        </div>
      )
    }
  </Query>
);

const RepoBrowser = ({ setRepository }) => (
  <Query query={REPO_QUERY}>
    {({ loading, error, data }) =>
      loading ? (
        "loading..."
      ) : !data ? (
        "error"
      ) : (
        <div
          style={{
            maxHeight: 320
          }}
          className="overflow-y-scroll w5 overflow-x-hidden"
        >
          {data.viewer.repositories.edges.map(repo => (
            <div
              className="bb pointer hover-bg-yellow pa1 pa2"
              onClick={() => setRepository(repo.node.id)}
            >
              <div>{repo.node.name}</div>
            </div>
          ))}
        </div>
      )
    }
  </Query>
);

export default class extends React.Component {
  state = {
    repository: undefined,
    login: undefined,
    prospectiveImportId: undefined
  };
  setRepository = repository => {
    this.setState({ repository });
  };
  clickFile = fileEntry => {
    const { type } = fileEntry;
    if (type === "blob") {
      this.setState({ prospectiveImportId: fileEntry.object.id });
      // Load file
    } else if (type === "tree") {
      // enter tree.
    }
  };
  render() {
    const { repository, prospectiveImportId } = this.state;
    const { toggleGithubModal } = this.props;
    const { clickFile, setRepository } = this;
    return (
      <div
        className="absolute absolute--fill bg-black-50 pa4"
        style={{
          zIndex: 998
        }}
      >
        <div className="relative">
          <div
            className="bg-white flex items-stretch"
            style={{
              zIndex: 999
            }}
          >
            <RepoBrowser setRepository={setRepository} />
            {repository && (
              <FileBrowser repository={repository} clickFile={clickFile} />
            )}
            {prospectiveImportId && <Import id={prospectiveImportId} />}
          </div>
          <span
            onClick={toggleGithubModal}
            className="absolute top-0 right-0 pa2 hover-bg-yellow pointer"
          >
            close
          </span>
        </div>
      </div>
    );
  }
}
