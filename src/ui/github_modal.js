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

const FileBrowser = ({ repository }) => (
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
          className="overflow-y-scroll"
        >
          {data.node.object
            ? data.node.object.entries.map(entry => (
                <div className="pv1">{entry.name}</div>
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
          className="overflow-y-scroll"
        >
          {data.viewer.repositories.edges.map(repo => (
            <div className="pv1" onClick={() => setRepository(repo.node.id)}>
              <div>{repo.node.name}</div>
              <div className="black-50">{repo.node.description}</div>
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
    login: undefined
  };
  setRepository = repository => {
    this.setState({ repository });
  };
  render() {
    const { repository } = this.state;
    return (
      <div
        className="absolute absolute--fill bg-black-50 pa4"
        style={{
          zIndex: 998
        }}
      >
        <div
          className="bg-white pa3 flex"
          style={{
            zIndex: 999
          }}
        >
          <RepoBrowser setRepository={this.setRepository} />
          {repository && <FileBrowser repository={repository} />}
        </div>
      </div>
    );
  }
}
