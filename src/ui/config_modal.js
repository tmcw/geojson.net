import React from "react";
import Config from "../panel/config";

export default class extends React.Component {
  render() {
    const {onCancel, onSubmit} = this.props;
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
          <Config onCancel={onCancel} onSubmit={onSubmit}/>
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
