import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export default class User extends React.Component {
  state = {
    privateRepoPermissions: false
  };
  setPrivateRepoPermissions = e => {
    this.setState({
      privateRepoPermissions: e.target.checked
    });
  };
  render() {
    const { privateRepoPermissions } = this.state;
    return (
      <Query
        query={gql`
          {
            viewer {
              login
              avatarUrl
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <span>...</span>;
          if (error)
            return (
              <a
                className="no-underline disappear-child relative pa2 black hover-bg-yellow"
                href={`/auth/github?scope=${
                  privateRepoPermissions ? "repo" : "public_repo"
                },read:org`}
              >
                Log in
                <div
                  className="child absolute right-0 bg-white pa2 ba w4"
                  style={{
                    top: 32,
                    zIndex: 999
                  }}
                >
                  <input
                    type="checkbox"
                    name="privateRepoPermissions"
                    onChange={this.setPrivateRepoPermissions}
                    checked={this.privateRepoPermissions}
                  />{" "}
                  <label htmlFor="privateRepoPermissions">private repos</label>
                </div>
              </a>
            );
          return (
            <div className="inline-flex items-center">
              <img src={data.viewer.avatarUrl} className="w2 h2 mr2" />
              {data.viewer.login}
              <a
                className="ph2 pointer hover-bg-yellow pa2 ml2"
                href="/auth/github/logout"
              >
                logout
              </a>
            </div>
          );
        }}
      </Query>
    );
  }
}
