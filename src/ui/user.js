import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import config from "../config";

export default () => (
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
        return <a href={`${config}/login?scope=repo,read:org`}>log in</a>;
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
