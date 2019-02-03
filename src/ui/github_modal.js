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

const ORG_QUERY = gql`
  {
    viewer {
      organizations(first: 100) {
        nodes {
          name
          id
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

const Import = ({ id, importGithub }) => (
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
            onClick={() => importGithub(data.node.text)}
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

const OrgBrowser = ({ setOrganization }) => (
  <Query query={ORG_QUERY}>
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
          {data.viewer.organizations.nodes.map(org => (
            <div
              key={org.id}
              className="bb pointer hover-bg-yellow pa1 pa2"
              onClick={() => setOrganization(org.id)}
            >
              <div>{org.name}</div>
            </div>
          ))}
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
              key={repo.node.id}
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

export default class GithubModal extends React.Component {
  state = {
    organization: undefined,
    repository: undefined,
    login: undefined,
    prospectiveImportId: undefined
  };
  setOrganization = organization => {
    this.setState({ organization });
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

  importGithub = text => {
    try {
      console.log(text);
      const json = JSON.parse(text);
      this.props.setGeojson(json);
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { repository, prospectiveImportId } = this.state;
    const { toggleGithubModal } = this.props;
    const { clickFile, setRepository, setOrganization } = this;
    return (
      <div
        className="absolute absolute--fill bg-black-50 pa4"
        id="backdrop"
        onClick={e => {
          if (e.target.id === "backdrop") toggleGithubModal();
        }}
        style={{
          zIndex: 998
        }}
      >
        <div className="relative">
          <div
            className="bg-white flex items-stretch ba"
            style={{
              maxHeight: '85vh',
              zIndex: 999
            }}
          >
            <OrgBrowser setOrganization={setOrganization} />
            <RepoBrowser setRepository={setRepository} />
            {repository && (
              <FileBrowser repository={repository} clickFile={clickFile} />
            )}
            {prospectiveImportId && <Import id={prospectiveImportId} importGithub={this.importGithub} />}
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
