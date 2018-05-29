import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GIST_QUERY = gql`
  query {
    viewer {
      gists(first: 100) {
        totalCount
        nodes {
          name
          id
          isPublic
          description
          createdAt
        }
      }
    }
  }
`;

const RepoBrowser = ({ setRepository }) => (
  <Query query={GIST_QUERY}>
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
          {data.viewer.gists.nodes.map(gist => (
            <div className="f6 bb b--black-10 pointer hover-bg-washed-blue pa1">
              <div>{gist.name}</div>
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
    const { clickFile, setRepository } = this;
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
          <RepoBrowser setRepository={setRepository} />
          {repository && (
            <FileBrowser repository={repository} clickFile={clickFile} />
          )}
          {prospectiveImportId && <Import id={prospectiveImportId} />}
        </div>
      </div>
    );
  }
}

/*
query { 
  viewer {
    gists(first:100) {
      totalCount,
      nodes {
        name,
        id,
        isPublic,
        description,
        createdAt
      }
    }
  }
}

query { 
  viewer {
    organizations(first:100) {
      totalCount,
      nodes {
        avatarUrl,
        name,
        id
      }
    }
  }
}
*/
