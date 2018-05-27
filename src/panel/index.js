import React from "react";
import Help from "./help";
import Code from "./json";
import Table from "./table";

export default (props) => {
  return props.mode === "code" ? (
    <Code {...props} />
  ) : props.mode === "table" ? (
    <Table {...props} />
  ) : (
    <Help />
  );
};
