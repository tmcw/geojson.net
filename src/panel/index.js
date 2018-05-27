import React from "react";
import Help from "./help";
import Code from "./json";
import Table from "./table";
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane;

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { setGeojson, geojson } = this.props;

    return (
        <Tabs animated={false}>
          <TabPane tab="JSON" key="1">
            <Code geojson={geojson} setGeojson={setGeojson} />
          </TabPane>
          <TabPane tab="Table" key="2">
            <Table geojson={geojson} setGeojson={setGeojson} />
          </TabPane>
          <TabPane tab="Help" key="3">
            <Help />
          </TabPane>
        </Tabs>
      )
  }
};
