import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import config from "../config";

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
                className="black-50 no-underline f6 disappear-child relative"
                href={`${config}/login?scope=${
                  privateRepoPermissions ? "repo" : "public_repo"
                },read:org`}
              >
                log in
                <div
                  className="child absolute right-0 bg-near-white pa2"
                  style={{
                    zIndex: 999
                  }}
                >
                  <input
                    type="checkbox"
                    name="privateRepoPermissions"
                    onChange={this.setPrivateRepoPermissions}
                    checked={this.privateRepoPermissions}
                  />{" "}
                  <label htmlFor="privateRepoPermissions">
                    Private repo permissions
                  </label>
                </div>
              </a>
            );
          return (
            <div className="inline-flex">
              <img src={data.viewer.avatarUrl} className="w1 h1 mr1" />
              {data.viewer.login}
              <a
                className="pl2 ml2 b--black-10 bl pointer"
                onClick={() => {
                  localStorage.removeItem("githubToken");
                  location.reload();
                }}
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
